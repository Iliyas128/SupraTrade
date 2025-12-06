import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import type { ApiProduct } from "@/types/catalog";

const RANDOM_CARDS_LIMIT = 15;

type DirectionCard = {
  name: string;
  slug: string;
  groups: { title: string; slug: string; items: { name: string; slug: string }[] }[];
};

const Catalog = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [directions, setDirections] = useState<DirectionCard[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [randomCache, setRandomCache] = useState<ApiProduct[]>([]);
  const [expandedDirections, setExpandedDirections] = useState<Record<string, boolean>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const prods = await catalogApi.getRandomProducts();
        const dirs: DirectionCard[] = catalogCategories.map((cat) => ({
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
        }));
        setDirections(dirs);
        setExpandedDirections(Object.fromEntries(dirs.map((d) => [d.slug, true])));
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
  }, [searchQuery]);

  const directionCards = useMemo(
    () =>
      directions.map((direction) => ({
        ...direction,
        slug: direction.slug ?? slugify(direction.name),
      })),
    [directions],
  );

  const toggleDirection = (slug: string) =>
    setExpandedDirections((prev) => ({ ...prev, [slug]: !prev[slug] }));

  const toggleGroup = (slug: string) =>
    setExpandedGroups((prev) => ({ ...prev, [slug]: !prev[slug] }));

    return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

        <main>
        <section className="section-padding">
          <div className="container-custom space-y-10">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-primary">
                Главная
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Каталог</span>
            </nav>

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
                  <div className="mt-4 space-y-2">
                    {directionCards.map((direction) => {
                      const dirOpen = expandedDirections[direction.slug] ?? true;
                      return (
                        <div key={direction.slug} className="rounded-xl border border-border/40 bg-background/80">
                          <button
                            onClick={() => toggleDirection(direction.slug)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition hover:text-primary"
                          >
                            {direction.name}
                            <ChevronDown
                              className={`h-4 w-4 transition ${dirOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                            />
                          </button>
                          {dirOpen && (
                            <div className="space-y-3 border-t border-border/30 px-4 py-3 text-sm text-muted-foreground">
                              {direction.groups.map((group) => {
                                const groupOpen = expandedGroups[group.slug] ?? false;
                                return (
                                  <div key={group.slug} className="rounded-lg border border-border/30 bg-background/60">
                                    <button
                                      onClick={() => toggleGroup(group.slug)}
                                      className="flex w-full items-center justify-between px-3 py-2 text-left font-semibold text-foreground transition hover:text-primary"
                                    >
                                      {group.title}
                                      <ChevronDown
                                        className={`h-4 w-4 transition ${groupOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                                      />
                                    </button>
                                    {groupOpen && (
                                      <ul className="border-t border-border/30 px-3 py-2 text-xs space-y-1">
                                        {group.items.map((item) => (
                                          <li key={item.slug}>
                                            <Link
                                              to={`/catalog/${direction.slug}/${group.slug}`}
                                              className="flex items-center justify-between rounded-md px-2 py-1 transition hover:bg-primary/5 hover:text-primary"
                                            >
                                              {item.name}
                                              <ChevronRight className="h-3 w-3" />
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {products.map((product) => (
                        <article
                          key={product.id}
                          className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/80 shadow-custom-md transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-custom-lg"
                        >
                          <div className="relative overflow-hidden rounded-t-2xl p-6">
                            <img
                              src={product.smallImage}
                              alt={product.shortTitle}
                              loading="lazy"
                              className="mx-auto"
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-4 p-6">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                {product.categories?.[0]?.name ?? "Категория"}
                              </p>
                              <h3 className="mt-2 text-lg font-semibold text-foreground">{product.shortTitle}</h3>
                              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
                            </div>
                            <div className="mt-auto flex items-center justify-between gap-3">
                              <Button className="flex-1" size="sm" onClick={() => setIsCallbackOpen(true)}>
                                Запросить КП
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link to={product.fullUrl}>
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

