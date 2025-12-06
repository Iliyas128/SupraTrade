import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import HeroSlider from "@/components/sections/HeroSlider";
import ProductCategories from "@/components/sections/ProductCategories";
import Directions from "@/components/sections/Directions";
import Advantages from "@/components/sections/Advantages";
import Services from "@/components/sections/Services";
import Stats from "@/components/sections/Stats";
import AboutSection from "@/components/sections/AboutSection";
import Reviews from "@/components/sections/Reviews";
import News from "@/components/sections/News";
import Partners from "@/components/sections/Partners";
import Licenses from "@/components/sections/Licenses";
import ContactCTA from "@/components/sections/ContactCTA";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CallbackModal from "@/components/CallbackModal";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header onCallbackClick={() => setIsCallbackOpen(true)} />
      
      <main>
        <HeroSlider />
        {/* <ProductCategories /> */}
        <Directions />
        <Advantages />
        <Services />
        <Stats />
        <AboutSection />
        <Reviews />
        <News />
        <Partners />
        <Licenses />
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
