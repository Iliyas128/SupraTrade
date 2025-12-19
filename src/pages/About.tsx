import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CallbackModal from "@/components/CallbackModal";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import HeroSection from "@/components/about/HeroSection";
import MissionSection from "@/components/about/MissionSection";
import ValuesSection from "@/components/about/ValuesSection";
import PartnersSection from "@/components/about/PartnersSection";
import CTASection from "@/components/about/CTASection";

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
    <div className="">
      <SEO
        title="О компании"
        description="SUPRA TRADE — комплексные решения в сфере снабжения, производства и подбора промышленной продукции. Комплексное снабжение предприятий, производство изделий под заказ, поставка промышленной продукции."
        keywords="SUPRA TRADE, о компании, поставщик промышленной продукции, комплексное снабжение, производство под заказ, Казахстан"
        structuredData={organizationStructuredData}
      />
      <TopBar onCallbackClick={() => setIsCallbackOpen(true)} />
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />

      <main>
        <HeroSection />
        <MissionSection />
        <ValuesSection />
        <PartnersSection />
        <CTASection onCallbackClick={() => setIsCallbackOpen(true)} />
      </main>

      <Footer />
      <FloatingButtons />
      <ChatWidget />
      <CallbackModal isOpen={isCallbackOpen} onClose={() => setIsCallbackOpen(false)} />
    </div>
  );
};

export default About;



