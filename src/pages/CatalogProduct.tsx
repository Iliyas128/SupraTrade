import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
import type { DetailedProduct, CategoryNode } from "@/types/catalog";

type TreeNode = CategoryNode & { fullSlug: string; children?: TreeNode[] };

const CatalogProduct = () => {
  const location = useLocation();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "guarantee" | "delivery" | "payment">("description");

  const catalogPath = useMemo(
    () => location.pathname.replace(/^\/?product\//, ""),
    [location.pathname],
  );

  const pathSegments = useMemo(() => catalogPath.split("/").filter(Boolean), [catalogPath]);

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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await catalogApi.getProductByPath(catalogPath);
        setProduct(data);
        const imgs = data.bigImages?.length ? data.bigImages : data.smallImage ? [data.smallImage] : [];
        setActiveImage(imgs[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [catalogPath]);

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

  const breadcrumbs = useMemo(() => {
    const crumbs = [
      { label: "Главная", href: "/" },
      { label: "Каталог", href: "/catalog" },
    ];

    // Убираем последний сегмент (это сам товар), оставляем только категории
    const categorySegments = pathSegments.slice(0, -1);
    if (categorySegments.length > 0) {
      const pathNodes = findPathNodes(tree, categorySegments);
      pathNodes.forEach((node, index) => {
        crumbs.push({
          label: node.name,
          href: `/catalog/${categorySegments.slice(0, index + 1).join("/")}`,
        });
      });
    }

    return crumbs;
  }, [tree, pathSegments]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onCallbackClick={() => setIsCallbackOpen(true)}/>
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

      <main>
        <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent py-4">
          <div className="container-custom space-y-4">
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
          </div>
        </section>
         <section className="mt-6 mb-8">
          <div className="container-custom">
            {loading ? (
              <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-custom-lg">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive shadow-custom-lg">
                {error}
              </div>
            ) : product ? (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">{product.fullTitle ?? product.shortTitle}</h1>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
                  <div className="space-y-4 h-full pb-[90px]">
                    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-custom-lg h-full min-h-[260px]">
                      <div className="flex h-full min-h-[300px] items-center justify-center bg-background">
                        <img
                          src={activeImage || product.bigImages?.[0] || product.smallImage || "/placeholder.svg"}
                          alt={product.shortTitle}
                          className="max-h-[280px] w-auto object-contain"
                        />
                      </div>
                    </div>
                    {(product.bigImages?.length || 0) > 1 && (
                      <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
                        {product.bigImages?.map((img) => (
                          <button
                            key={img}
                            onClick={() => setActiveImage(img)}
                            className={cn(
                              "overflow-hidden rounded-xl border transition hover:border-primary/50",
                              activeImage === img ? "border-primary ring-2 ring-primary/40" : "border-border/60",
                            )}
                          >
                            <img src={img} alt="thumb" className="h-24 w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 h-full">
                    <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-custom-md h-full min-h-[440px] flex flex-col gap-4">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-foreground">Цена по запросу</div>
                        <div className="text-sm text-emerald-600 font-semibold">В наличии</div>
                      </div>
                      {product.characteristics && Object.keys(product.characteristics).length > 0 && (
                        <div className="space-y-2">
                          <h2 className="text-base font-semibold text-foreground">Технические характеристики</h2>
                          <dl className="space-y-2 text-sm text-muted-foreground">
                            {Object.entries(product.characteristics)
                              .slice(0, 3)
                              .map(([key, value]) => (
                                <div key={key} className="grid grid-cols-[1fr,1.4fr] gap-3">
                                  <dt className="font-semibold text-foreground">{key}</dt>
                                  <dd>{value}</dd>
                                </div>
                              ))}
                          </dl>
                          {Object.keys(product.characteristics).length > 3 && (
                            <button
                              className="text-primary text-sm font-semibold hover:underline"
                              onClick={() => setActiveTab("specs")}
                            >
                              Все характеристики
                            </button>
                          )}
                        </div>
                      )}
                      <div className="mt-auto flex flex-wrap gap-3">
                        <Button size="lg" onClick={() => setIsCallbackOpen(true)}>
                          Запросить КП
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                          <Link to="/catalog">Вернуться в каталог</Link>
                        </Button>
                      </div>
                    </div>

                    {product.tags && product.tags.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Теги</p>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.slice(0, 12).map((tag) => (
                            <Badge key={tag} variant="outline" className="border-border/60 bg-background/60">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "description", label: "Описание" },
                      { id: "specs", label: "Характеристики" },
                      { id: "guarantee", label: "Гарантии" },
                      { id: "delivery", label: "Доставка" },
                      { id: "payment", label: "Оплата" },
                    ].map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab(tab.id as any)}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-custom-lg">
                    {activeTab === "description" && (
                      <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">Описание</h2>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {product.description || "Описание будет доступно по запросу."}
                        </p>
                      </div>
                    )}

                    {activeTab === "specs" && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Технические характеристики</h2>
                        {product.characteristics && Object.keys(product.characteristics).length > 0 ? (
                          <dl className="grid gap-3 text-sm text-muted-foreground">
                            {Object.entries(product.characteristics).map(([key, value]) => (
                              <div
                                key={key}
                                className="grid grid-cols-[1fr,2fr] items-start gap-3 border-b border-border/30 pb-3 last:border-b-0 last:pb-0"
                              >
                                <dt className="font-semibold text-foreground">{key}</dt>
                                <dd>{value}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <p className="text-muted-foreground">Характеристики отсутствуют.</p>
                        )}
                      </div>
                    )}

                    {activeTab === "guarantee" && (
                      <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">Гарантии</h2>
                        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                          <li>Сертифицированный товар</li>
                          <li>Официальная гарантия 12 месяцев</li>
                          <li>Собственный сервисный центр</li>
                          <li>Возврат без проблем</li>
                        </ul>
                      </div>
                    )}

                    {activeTab === "delivery" && (
                      <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">Доставка</h2>
                        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                          <li>Доставка по всему Казахстану</li>
                          <li>Самовывоз со склада</li>
                          <li>Курьерская доставка по городу</li>
                          <li>Проверка товара перед отправкой</li>
                        </ul>
                      </div>
                    )}

                    {activeTab === "payment" && (
                      <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">Оплата</h2>
                        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                          <li>Заказы принимаются после 100% предоплаты или по согласованию</li>
                          <li>Договор и акт при необходимости</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-custom-lg">
                Товар не найден.
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

export default CatalogProduct;



