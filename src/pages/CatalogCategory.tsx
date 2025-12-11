import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CallbackModal from "@/components/CallbackModal";
import ChatWidget from "@/components/ChatWidget";
import ContactCTA from "@/components/sections/ContactCTA";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { catalogApi } from "@/lib/api";
import { cn, slugify } from "@/lib/utils";
import { catalogCategories } from "@/data/catalogData";
import type { ApiProduct, CategoryNode } from "@/types/catalog";

const PAGE_SIZE = 15;
type TreeNode = CategoryNode & { fullSlug: string; children?: TreeNode[] };

const ProductCardSkeleton = () => (
  <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/80 shadow-custom-md">
    <div className="relative overflow-hidden rounded-t-2xl bg-muted">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted-foreground/10" />
    </div>
    <div className="flex flex-1 flex-col gap-3 p-6">
      <div className="h-3 w-24 animate-pulse rounded bg-muted-foreground/10" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-muted-foreground/10" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-muted-foreground/10" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted-foreground/10" />
      </div>
      <div className="mt-auto flex items-center gap-3">
        <div className="h-10 w-24 animate-pulse rounded bg-muted-foreground/10" />
        <div className="h-10 w-24 animate-pulse rounded bg-muted-foreground/10" />
      </div>
    </div>
  </div>
);

const CatalogCategory = () => {
  const location = useLocation();
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [fallbackProducts, setFallbackProducts] = useState<ApiProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement | null>(null);
  const autoScrolledRef = useRef(false);

  const categoryPath = useMemo(
    () => location.pathname.replace(/^\/?catalog\/?/, "").replace(/\/+$/, ""),
    [location],
  );

  const withPaths = (nodes: CategoryNode[], parent = ""): TreeNode[] =>
    nodes.map((n) => {
      const fullSlug = [parent, n.slug].filter(Boolean).join("/");
      return { ...n, fullSlug, children: n.children ? withPaths(n.children, fullSlug) : [] };
    });

  const fallbackTree = useMemo<TreeNode[]>(() => {
    return catalogCategories.map((cat) => {
      const catSlug = cat.slug ?? slugify(cat.name);
      return {
        _id: catSlug,
        name: cat.name,
        slug: catSlug,
        fullSlug: catSlug,
        children: cat.groups.map((group) => {
          const groupSlug = group.slug ?? slugify(group.title);
          return {
            _id: `${catSlug}-${groupSlug}`,
            name: group.title,
            slug: groupSlug,
            fullSlug: `${catSlug}/${groupSlug}`,
            children: (group.items ?? []).map((item) => {
              const itemSlug = item.slug ?? slugify(item.name);
              return {
                _id: `${catSlug}-${groupSlug}-${itemSlug}`,
                name: item.name,
                slug: itemSlug,
                fullSlug: `${catSlug}/${groupSlug}/${itemSlug}`,
              } as TreeNode;
            }),
          } as TreeNode;
        }),
      } as TreeNode;
    });
  }, []);

  useEffect(() => {
    const loadTree = async () => {
      try {
        const res = await catalogApi.getCategoryTree().catch(() => ({ tree: [] }));
        const t = withPaths(res.tree || []);
        setTree(t.length ? t : fallbackTree);
      } catch {
        setTree(fallbackTree);
      }
    };
    loadTree();
  }, [fallbackTree]);

  const loadProducts = useCallback(
    async (pageToLoad: number, append = false) => {
      if (!categoryPath) return;
      try {
        append ? setLoadingMore(true) : setLoading(true);
        const res = await catalogApi.getProductsByCategory(categoryPath, pageToLoad, PAGE_SIZE);
        setProducts((prev) => (append ? [...prev, ...res.products] : res.products));
        setHasMore((res.totalPages ?? 1) > pageToLoad);
        setPage(pageToLoad);
        if (!append && (res.products?.length ?? 0) === 0) {
          // если нет прямых товаров, попробуем поиск по последнему сегменту
          const last = categoryPath.split("/").filter(Boolean).pop() || "";
          if (last) {
            try {
              const searchRes = await catalogApi.searchProducts(last, 1, 30);
              const shuffled = [...(searchRes.products ?? [])].sort(() => Math.random() - 0.5);
              setFallbackProducts(shuffled.slice(0, 15));
            } catch {
              setFallbackProducts([]);
            }
          } else {
            setFallbackProducts([]);
          }
        } else if (!append) {
          setFallbackProducts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить товары");
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [categoryPath],
  );

  useEffect(() => {
    const bootstrap = async () => {
      if (!categoryPath) {
        navigate("/catalog");
        return;
      }
      await loadProducts(1);
    };
    bootstrap();
    autoScrolledRef.current = false;
  }, [categoryPath, loadProducts, navigate]);

  useEffect(() => {
    if (loading || products.length === 0 || autoScrolledRef.current) return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile && productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      autoScrolledRef.current = true;
    }
  }, [loading, products]);

  const findPathNodes = (nodes: TreeNode[], segments: string[]): TreeNode[] => {
    if (segments.length === 0) return [];
    const [head, ...rest] = segments;
    for (const n of nodes) {
      if (n.slug === head) {
        if (rest.length === 0) return [n];
        const childPath = findPathNodes(n.children || [], rest);
        if (childPath.length) return [n, ...childPath];
      }
    }
    return [];
  };

  const pathSegments = useMemo(() => categoryPath.split("/").filter(Boolean), [categoryPath]);
  const activePath = useMemo(() => findPathNodes(tree, pathSegments), [tree, pathSegments]);
  const activeLeaf = activePath[activePath.length - 1];
  const childCategories = useMemo(() => activeLeaf?.children ?? [], [activeLeaf]);
  const childSample = useMemo(() => {
    if (!childCategories.length) return [];
    const shuffled = [...childCategories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }, [childCategories]);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    ...activePath.map((node, idx) => ({
      label: node.name,
      href: `/catalog/${activePath.slice(0, idx + 1).map((n) => n.slug).join("/")}`,
    })),
  ];

  const renderTree = (nodes: TreeNode[], level = 0) => (
    <ul className={level === 0 ? "space-y-3" : "space-y-1 pl-3 border-l border-border/30"}>
      {nodes.map((node) => {
        const isActive = activeLeaf?.fullSlug === node.fullSlug;
        return (
          <li key={node.fullSlug} className="rounded-xl border border-border/40 bg-background/80">
            <Link
              to={`/catalog/${node.fullSlug}`}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition hover:text-primary",
                isActive && "text-primary",
              )}
            >
              <span>{node.name}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {node.children && node.children.length > 0 && (
              <div className="border-t border-border/30 px-4 py-3 text-sm text-muted-foreground">
                {renderTree(node.children, level + 1)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar onCallbackClick={() => setIsCallbackOpen(true)} />
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

      <main>
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-6">
          <div className="container-custom space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href}>
                  <Link to={crumb.href} className="transition-colors hover:text-primary">
                    {crumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && <span className="mx-2 text-muted-foreground">/</span>}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Категория
                </p>
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  {activeLeaf?.name ?? "Категория"}
                </h1>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>
            </div>
          </div>
        </section>

        {childSample.length > 0 && (
          <section>
            <div className="container-custom space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-border/60 bg-background/60">
                  {childSample.length} из {childCategories.length}
                </Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {childSample.map((child) => (
                  <Link
                    to={`/catalog/${child.fullSlug}`}
                    key={child.fullSlug}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-custom-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-custom-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={
                          (child as any).image ||
                          (child as any).icon ||
                          (child as any).thumbnail ||
                          (child as any).thumb ||
                          (child as any).cover ||
                          "/placeholder.svg"
                        }
                        alt={child.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3">
                      <span className="font-semibold text-sm text-foreground">{child.name}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding">
          <div className="container-custom grid gap-10 lg:grid-cols-[300px,minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-border/70 bg-card/70 p-6 shadow-custom-lg lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Категории</p>
              <div className="mt-4">{renderTree(tree)}</div>
            </aside>

            <div className="space-y-8" ref={productsRef}>
              {loading ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="h-3 w-24 animate-pulse rounded bg-muted-foreground/10" />
                      <div className="mt-2 h-6 w-40 animate-pulse rounded bg-muted-foreground/10" />
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded bg-muted-foreground/10" />
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <ProductCardSkeleton key={idx} />
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive shadow-custom-lg">
                  {error}
                </div>
              ) : (products.length === 0 && fallbackProducts.length === 0) ? (
                <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-custom-lg">
                  В этой категории пока нет товаров.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        Товары
                      </p>
                      <h2 className="text-2xl font-bold text-foreground">{activeLeaf?.name ?? "Категория"}</h2>
                    </div>
                    <Badge variant="outline" className="border-border/60 bg-background/60">
                      {(products.length || fallbackProducts.length)} позиций
                    </Badge>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {(products.length ? products : fallbackProducts).map((product) => (
                      <article
                        key={product.id}
                        className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/80 shadow-custom-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-custom-lg"
                      >
                        <div className="relative overflow-hidden rounded-t-2xl bg-muted aspect-[4/3] flex items-center justify-center p-6">
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/0 to-black/0" />
                          <img
                            src={product.smallImage || (product as any).small_image || product.bigImages?.[0] || "/placeholder.svg"}
                            alt={product.shortTitle}
                            loading="lazy"
                            className="mx-auto h-full w-full object-contain"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-4 p-6">
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            {product.categoryPath?.[product.categoryPath.length - 1]?.name ??
                              product.categories?.[product.categories.length - 1]?.name ??
                              "Категория"}
                          </p>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{product.shortTitle}</h3>
                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between gap-3">
                            <Button className="flex-1" size="sm" onClick={() => setIsCallbackOpen(true)}>
                              Запросить КП
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                              <Link to={`/product/${product.fullUrl.replace(/^\/?product\//, "").replace(/^\/catalog\//, "")}`}>
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {products.length > 0 && hasMore && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        disabled={loadingMore}
                        onClick={() => loadProducts(page + 1, true)}
                      >
                        {loadingMore ? "Загружаем..." : "Показать ещё"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <ContactCTA onCallbackClick={() => setIsCallbackOpen(true)} />
      </main>

      <Footer />
      <FloatingButtons />
      <ChatWidget />
      <CallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
    </div>
  );
};

export default CatalogCategory;

