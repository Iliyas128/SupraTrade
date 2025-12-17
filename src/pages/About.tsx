import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CallbackModal from "@/components/CallbackModal";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import heroIndustrial from "@/assets/hero-industrial.jpg";

const features = [
  "Более 1400 видов продукции",
  "Сотрудничество с 700+ поставщиками",
  "Собственная лаборатория в Китае",
  "Гарантия качества продукции",
  "Конкурентоспособные цены",
];

const About = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SUPRA TRADE",
    description: "Комплексные решения в сфере снабжения, производства и подбора промышленной продукции",
    url: typeof window !== "undefined" ? window.location.origin : "",
    logo: typeof window !== "undefined" ? `${window.location.origin}/logo.svg` : "/logo.svg",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed: ["KZ", "RU", "BY", "UZ"],
      availableLanguage: ["Russian"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "KZ",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="О компании"
        description="SUPRA TRADE — комплексные решения в сфере снабжения, производства и подбора промышленной продукции. Комплексное снабжение предприятий, производство изделий под заказ, поставка промышленной продукции."
        keywords="SUPRA TRADE, о компании, поставщик промышленной продукции, комплексное снабжение, производство под заказ, Казахстан"
        structuredData={organizationStructuredData}
      />
      <TopBar onCallbackClick={() => setIsCallbackOpen(true)} />
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

      <main>
        {/* Breadcrumbs */}
        <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent py-3 md:py-4">
          <div className="container-custom">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-primary">
                Главная
              </Link>
              <span>/</span>
              <span className="text-foreground">О компании</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="mb-8">
              <Button variant="outline" className="gap-2 mb-6" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Назад на главную
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                О <span className="text-primary">компании</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
              <div className="relative">
                <img
                  src={heroIndustrial}
                  alt="О компании SUPRA TRADE"
                  className="rounded-2xl shadow-custom-xl w-full"
                  loading="lazy"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Наша миссия</h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    Основная стратегическая задача нашей компании — обеспечить предприятия комплексными решениями в сфере снабжения,
                    производства и подбора промышленной продукции, закрывая ключевые потребности бизнеса в одном месте.
                  </p>
                </div>

                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Наша специализация</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                  <p>
                    Мы специализируемся на комплексном снабжении предприятий, производстве изделий под заказ и поставке промышленной
                    продукции для различных отраслей. Организуем поставки материалов, комплектующих и оборудования, изготавливаем
                    изделия по индивидуальным чертежам и техническим требованиям, а также подбираем оптимальные решения под конкретные
                    задачи заказчика.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Наши принципы работы</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                  <p>
                    В работе мы делаем акцент на качестве, надёжности и соблюдении сроков. Сотрудничаем с проверенными поставщиками и
                    производственными партнёрами, что позволяет гарантировать стабильные характеристики продукции и бесперебойность
                    поставок. Предлагаем удобные условия комплектации, оплаты и доставки заказов с учётом требований и пожеланий клиента.
                  </p>
                  <p>
                    Мы ценим каждого партнёра и выстраиваем долгосрочные деловые отношения, постоянно совершенствуя уровень сервиса и
                    расширяя возможности для наших клиентов.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Наши поставщики и партнёры</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                <p>
                  Мы работаем только с надёжными производителями и поставщиками промышленной продукции. Это позволяет нам гарантировать
                  высокое качество поставляемых материалов, комплектующих и оборудования.
                </p>
                <p>
                  По запросу клиента обеспечиваем поставку продукции от конкретного производителя и в согласованные сроки, подбирая
                  оптимальные решения для стабильной работы вашего предприятия.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Готовы начать <span className="text-primary">сотрудничество</span>?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Свяжитесь с нами для получения персонального предложения и консультации
              </p>
              <Button size="lg" onClick={() => setIsCallbackOpen(true)}>
                Связаться с нами
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingButtons />
      <ChatWidget />
      <CallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
    </div>
  );
};

export default About;



