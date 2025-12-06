import { MessageCircle, Phone, ArrowUp, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/77006801500"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-success text-primary-foreground rounded-full shadow-custom-xl flex items-center justify-center hover:scale-110 hover:shadow-glow transition-all animate-pulse-glow"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} />
      </a>

      {/* Phone Button */}
      <a
        href="tel:+77006801500"
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-custom-xl flex items-center justify-center hover:scale-110 transition-all"
        aria-label="Позвонить"
      >
        <Phone size={24} />
      </a>


      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-14 h-14 bg-card text-foreground border border-border rounded-full shadow-custom-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all"
          aria-label="Наверх"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
