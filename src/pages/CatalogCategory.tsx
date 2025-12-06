import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
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
import type { ApiProduct } from "@/types/catalog";

const PAGE_SIZE = 15;

const CatalogCategory = () => {
  const { primarySlug, subSlug } = useParams();
  const categorySlug = (subSlug ?? primarySlug) as string | undefined;
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [directions] = useState(
    catalogCategories.map((cat) => ({
      name: cat.name,
      slug: cat.slug ?? slugify(cat.name),
      groups: cat.groups.map((group) => ({
        title: group.title,
        slug: group.slug ?? slugify(group.title),
        items: group.items.map((item) => ({
          name: item.name,
          slug: item.slug ?? slugify(item.name),
        })),
      })),
    })),
  );
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement | null>(null);
  const autoScrolledRef = useRef(false);

  const normalizedDirections = useMemo(() => directions, [directions]);

  const directionInfo = useMemo(() => {
    if (!primarySlug) return null;
    return normalizedDirections.find((dir) => dir.slug === primarySlug);
  }, [normalizedDirections, primarySlug]);

  const groupInfo = useMemo(() => {
    if (!directionInfo || !subSlug) return null;
    return directionInfo.groups.find((group) => group.slug === subSlug);
  }, [directionInfo, subSlug]);

  const loadProducts = useCallback(
    async (pageToLoad: number, append = false) => {
      if (!categorySlug) return;
      try {
        append ? setLoadingMore(true) : setLoading(true);
        const res = await catalogApi.getProductsByCategory(categorySlug, pageToLoad, PAGE_SIZE);
        setProducts((prev) => (append ? [...prev, ...res.products] : res.products));
        setHasMore((res.totalPages ?? 1) > pageToLoad);
        setPage(pageToLoad);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить товары");
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [categorySlug],
  );

  useEffect(() => {
    const bootstrap = async () => {
      if (!categorySlug) {
        navigate("/catalog");
        return;
      }
      await loadProducts(1);
    };
    bootstrap();
    autoScrolledRef.current = false;
  }, [categorySlug, loadProducts, navigate]);

  useEffect(() => {
    if (loading || products.length === 0 || autoScrolledRef.current) return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile && productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      autoScrolledRef.current = true;
    }
  }, [loading, products]);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
  ];

  if (directionInfo) {
    breadcrumbs.push({ label: directionInfo.name, href: `/catalog/${directionInfo.slug}` });
  }

  if (groupInfo) {
    breadcrumbs.push({
      label: groupInfo.title,
      href: `/catalog/${directionInfo?.slug}/${groupInfo.slug}`,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

      <main className="pb-16">
        <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent py-10">
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
                  {groupInfo ? "Подсекция" : "Направление"}
                </p>
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  {groupInfo?.title ?? directionInfo?.name ?? "Категория"}
                </h1>
                {directionInfo && (
                  <p className="mt-3 max-w-2xl text-muted-foreground">
                    Каталог оборудования и материалов для отрасли «{directionInfo.name}». Уточните спецификацию через форму
                    обратной связи или оставьте заявку на подбор.
                  </p>
                )}
              </div>
              <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid gap-10 lg:grid-cols-[300px,minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-border/70 bg-card/70 p-6 shadow-custom-lg lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Направления</p>
              <div className="mt-4 space-y-3">
                {normalizedDirections.map((direction) => (
                  <div key={direction.slug} className="rounded-xl border border-border/40 bg-background/80">
                    <Link
                      to={`/catalog/${direction.slug}`}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition",
                        direction.slug === primarySlug ? "text-primary" : "text-foreground",
                      )}
                    >
                      {direction.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    {direction.slug === primarySlug && (
                      <ul className="space-y-3 border-t border-border/30 px-4 py-3 text-xs text-muted-foreground">
                        {direction.groups.map((group) => (
                          <li key={group.slug} className="space-y-1">
                            <div
                              className={cn(
                                "flex items-center justify-between",
                                group.slug === subSlug && "text-primary",
                              )}
                            >
                              <span className="font-semibold text-foreground">{group.title}</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </div>
                            <ul className="space-y-1">
                              {group.items.map((item) => (
                                <li key={item.slug}>
                                  <Link
                                    to={`/catalog/${direction.slug}/${group.slug}`}
                                    className="flex items-center justify-between rounded-lg px-2 py-1 transition hover:bg-primary/5 hover:text-primary"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            <div className="space-y-8" ref={productsRef}>
              {loading ? (
                <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-custom-lg">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive shadow-custom-lg">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-custom-lg">
                  В этой категории пока нет товаров.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Товары</p>
                      <h2 className="text-2xl font-bold text-foreground">
                        {groupInfo?.title ?? directionInfo?.name ?? "Категория"}
                      </h2>
                    </div>
                    <Badge variant="outline" className="border-border/60 bg-background/60">
                      {products.length} позиций
                    </Badge>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {products.map((product) => (
                      <article
                        key={product.id}
                        className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/80 shadow-custom-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-custom-lg"
                      >
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <img
                            src={product.smallImage}
                            alt={product.shortTitle}
                            loading="lazy"
                            className="mx-auto"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-6">
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            {product.categories?.[product.categories.length - 1]?.name}
                          </p>
                          <h3 className="text-lg font-semibold text-foreground">{product.shortTitle}</h3>
                          <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
                          <div className="mt-auto flex items-center justify-between gap-3">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={product.fullUrl}>Подробнее</Link>
                            </Button>
                            <Button size="sm" onClick={() => setIsCallbackOpen(true)}>
                              Получить КП
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {hasMore && (
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

