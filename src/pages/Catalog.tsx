import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
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
import { slugify } from "@/lib/utils";
import { catalogCategories } from "@/data/catalogData";
import type { ApiProduct, CategoryNode } from "@/types/catalog";

const RANDOM_CARDS_LIMIT = 15;

type TreeNode = CategoryNode & { fullSlug: string; children?: TreeNode[] };

const Catalog = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [randomCache, setRandomCache] = useState<ApiProduct[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("q") ?? "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const withPaths = (nodes: CategoryNode[], parentPath = ""): TreeNode[] =>
    nodes.map((n) => {
      const fullSlug = [parentPath, n.slug].filter(Boolean).join("/");
      return {
        ...n,
        fullSlug,
        children: n.children ? withPaths(n.children, fullSlug) : [],
      };
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
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const catRes = await catalogApi.getCategoryTree().catch(() => ({ tree: [] }));
        const treeWithPaths = withPaths(catRes.tree || []);
        const finalTree = treeWithPaths.length ? treeWithPaths : fallbackTree;
        setTree(finalTree);
        setExpanded(Object.fromEntries(finalTree.map((n) => [n.fullSlug || n.slug, true])));
        const prods = await catalogApi.getRandomProducts();
        const limited = prods.slice(0, RANDOM_CARDS_LIMIT);
        setRandomCache(limited);

        if (searchQuery.trim()) {
          const res = await catalogApi.searchProducts(searchQuery.trim(), 1, RANDOM_CARDS_LIMIT);
          setProducts(res.products);
        } else {
          setProducts(limited);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить каталог");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [searchQuery, fallbackTree]);

  const toggleNode = (slug: string) => setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));

  const renderTree = (nodes: TreeNode[], level = 0) => (
    <div className={level === 0 ? "space-y-2" : "space-y-1 pl-3 border-l border-border/30"}>
      {nodes.map((node) => {
        const open = expanded[node.fullSlug] ?? level === 0;
        const hasChildren = node.children && node.children.length > 0;
        return (
          <div key={node.fullSlug} className="rounded-xl border border-border/40 bg-background/80">
            <button
              onClick={() => (hasChildren ? toggleNode(node.fullSlug) : navigate(`/catalog/${node.fullSlug}`))}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition hover:text-primary"
            >
              {node.name}
              {hasChildren && (
                <ChevronDown
                  className={`h-4 w-4 transition ${open ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                />
              )}
            </button>
            {open && hasChildren && (
              <div className="border-t border-border/30 px-4 py-3 text-sm text-muted-foreground">
                {renderTree(node.children!, level + 1)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

    return (
    <div className="min-h-screen bg-background">
      <TopBar onCallbackClick={() => setIsCallbackOpen(true)}/>
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

        <main>
        <section className="bg-gradient-to-b from-primary/5 to-transparent pt-10">
          <div className="container-custom space-y-2">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-primary">
                Главная
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Каталог</span>
            </nav>
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Все категории
              </h1>
            </div>
          </div>
        </section>

        {tree.length > 0 && (
          <section className="border-b border-border/40 pt-2">
            <div className="container-custom space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground md:text-xl">
                    Основные направления
                  </h2>
                </div>
                <Badge variant="outline" className="border-border/60 bg-background/60">
                  {tree.length} категорий
                </Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {tree.map((category) => (
                  <Link
                    to={`/catalog/${category.fullSlug}`}
                    key={category.fullSlug}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-custom-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-custom-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={
                          (category as any).image ||
                          (category as any).icon ||
                          (category as any).thumbnail ||
                          (category as any).thumb ||
                          (category as any).cover ||
                          "/placeholder.svg"
                        }
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3">
                      <span className="font-semibold text-sm text-foreground">{category.name}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding">
          <div className="container-custom space-y-10">
            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-custom-lg">
                Загружаем каталог...
              </div>
            ) : (
              <div className="grid gap-10 lg:grid-cols-[320px,minmax(0,1fr)]">
                <aside className="h-fit rounded-2xl border border-border/70 bg-card/70 p-6 shadow-custom-lg lg:sticky lg:top-24">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Категории</p>
                  <div className="mt-4">{renderTree(tree)}</div>
                </aside>

                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Карточки товаров
                      </p>
                      <h2 className="text-2xl font-bold text-foreground">Подборка решений</h2>
                    </div>
                    <Badge variant="outline" className="border-border/60 bg-background/60">
                      {products.length} позиций
                    </Badge>
                  </div>

                  {products.length === 0 ? (
                    <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-custom-lg">
                      Товары не найдены. Попробуйте другой запрос.
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                      {products.map((product) => (
                        <article
                          key={product.id}
                          className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/80 shadow-custom-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-custom-lg"
                        >
                          <div className="relative overflow-hidden rounded-t-2xl p-6">
                            <img
                              src={product.smallImage || product.bigImages?.[0] || "/placeholder.svg"}
                              alt={product.shortTitle}
                              loading="lazy"
                              className="mx-auto"
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-4 p-6">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                {product.categoryPath?.[product.categoryPath.length - 1]?.name ??
                                  product.categories?.[0]?.name ??
                                  "Категория"}
                              </p>
                              <h3 className="mt-2 text-lg font-semibold text-foreground">{product.shortTitle}</h3>
                              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
                            </div>
                            <div className="mt-auto flex items-center justify-between gap-3">
                              <Button className="flex-1" size="sm" onClick={() => setIsCallbackOpen(true)}>
                                Запросить КП
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link to={`/product${product.fullUrl.replace(/^\/catalog/, "")}`}>
                                  <ArrowUpRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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

export default Catalog;

