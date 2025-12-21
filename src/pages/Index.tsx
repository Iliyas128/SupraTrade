import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import HeroSlider from "@/components/sections/HeroSlider";
import ProductCategories from "@/components/sections/ProductCategories";
import Directions from "@/components/sections/Directions";
import Advantages from "@/components/sections/Advantages";
import Services from "@/components/sections/Services";
import Stats from "@/components/sections/Stats";
import QualityReasons from "@/components/sections/QualityReasons";
import AboutSection from "@/components/sections/AboutSection";
import Partners from "@/components/sections/Partners";
import Licenses from "@/components/sections/Licenses";
import ContactCTA from "@/components/sections/ContactCTA";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CallbackModal from "@/components/CallbackModal";
import ChatWidget from "@/components/ChatWidget";
import SEO from "@/components/SEO";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SUPRA TRADE",
  description: "Надёжный поставщик металлопроката, химических реактивов, медицинского и промышленного оборудования в Казахстане и СНГ",
  url: typeof window !== "undefined" ? window.location.origin : "https://supratrade.kz",
  logo: typeof window !== "undefined" ? `${window.location.origin}/logo.svg` : "https://supratrade.kz/logo.svg",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: "+77083767189",
    email: "sales@supratrade.kz",
    areaServed: ["KZ", "RU", "BY", "UZ"],
    availableLanguage: ["Russian"]
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Магзи Абулкасымова, 115",
    addressLocality: "Кокшетау",
    addressCountry: "KZ"
  },
  sameAs: []
};

const Index = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Главная"
        description="SUPRA TRADE — надёжный поставщик металлопроката, химических реактивов, медицинского и промышленного оборудования в Казахстане и СНГ. Более 1400 видов продукции. Комплексное снабжение предприятий."
        structuredData={organizationStructuredData}
      />
      <TopBar onCallbackClick={() => setIsCallbackOpen(true)} />
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />
      
      <main>
        <HeroSlider />
        {/* <ProductCategories /> */}
        <Directions />
        <Stats />
        <Services />
        <QualityReasons />
        <AboutSection />
        <ContactCTA onCallbackClick={() => setIsCallbackOpen(true)} />
      </main>
      <Footer />
      <FloatingButtons />
      <ChatWidget />
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
      />
    </div>
  );
};

export default Index;
