import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import type { DetailedProduct } from "@/types/catalog";

const CatalogProduct = () => {
  const { primarySlug, subSlug, rest } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const pathSegments = useMemo(() => {
    const segments = [primarySlug, subSlug];
    if (rest) {
      segments.push(...rest.split("/"));
    }
    return segments.filter(Boolean) as string[];
  }, [primarySlug, subSlug, rest]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const path = location.pathname.replace(/^\/?catalog\//, "");
        const data = await catalogApi.getProductByPath(path);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [location.pathname]);

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
  ];

  pathSegments.forEach((segment, index) => {
    breadcrumbs.push({
      label: segment,
      href: `/catalog/${pathSegments.slice(0, index + 1).join("/")}`,
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar onCallbackClick={() => setIsCallbackOpen(true)}/>
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

      <main className="pb-16">
        <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent py-10">
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
            <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </div>
        </section>

        <section className="section-padding">
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
              <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="grid gap-4">
                    {(product.bigImages ?? [product.smallImage]).map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={product.shortTitle}
                        className="w-full rounded-2xl border border-border/40 object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {product.categories.map((category) => category.name).join(" / ")}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-foreground">{product.fullTitle ?? product.shortTitle}</h1>
                    <p className="mt-4 text-muted-foreground whitespace-pre-line">{product.description}</p>
                  </div>

                  {product.characteristics && Object.keys(product.characteristics).length > 0 && (
                    <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-custom-md">
                      <h2 className="text-lg font-semibold text-foreground">Характеристики</h2>
                      <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
                        {Object.entries(product.characteristics).map(([key, value]) => (
                          <div key={key} className="grid gap-3 border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
                            <dt className="font-semibold text-foreground">{key}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

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

                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" onClick={() => setIsCallbackOpen(true)}>
                      Запросить коммерческое предложение
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/catalog">Вернуться в каталог</Link>
                    </Button>
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



