import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const isProductPage = segments[0] === "catalog" && segments.length >= 4;

    // Если есть hash, скроллим к элементу
    if (hash) {
      const targetId = hash.replace("#", "");
      const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (!scrollToTarget()) {
        const timer = setTimeout(scrollToTarget, 100);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Для всех страниц (кроме product pages с hash) скроллим наверх
    // Используем instant для мгновенного скролла без анимации
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

