import { useEffect, useRef, useState } from "react";
import armaturaIcon from "@/assets/maxIcons/armaturaIcon.png";
import papersIcon from "@/assets/maxIcons/PapersIcon.png";
import transferIcon from "@/assets/maxIcons/ApparatIcon.png";
import { useTranslation } from "react-i18next";

const QualityReasons = () => {
  const { t } = useTranslation();
  const reasons = [
    { icon: armaturaIcon, title: t("quality.items.0") },
    { icon: papersIcon, title: t("quality.items.1") },
    { icon: transferIcon, title: t("quality.items.2") },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "5px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-[#fdfffe]">
      <div className="container-custom">
        <h2 
          className={`text-lg md:text-xl lg:text-2xl font-bold text-[#1E1E1E] mb-10 md:mb-14 max-w-md transform transition-all duration-800 ease-out will-change-transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {t("quality.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center transform transition-all duration-500 ease-out will-change-transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${index * 100 + 150}ms` : "0ms" }}
            >
              <div className="w-full h-48 md:h-56 lg:h-64 flex items-center justify-center mb-6">
                <img
                  src={reason.icon}
                  alt={reason.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#1E1E1E] leading-snug">
                {reason.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualityReasons;

