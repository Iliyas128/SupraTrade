import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import heroMetal from "@/assets/hero-metal.jpg";
import heroMedical from "@/assets/hero-medical.jpg";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    image: heroIndustrial,
    title: "Надёжный поставщик",
    subtitle: "промышленного оборудования",
    description: "Металлопрокат, химические реактивы, медицинское и промышленное оборудование с доставкой по Казахстану и СНГ",
  },
  {
    id: 2,
    image: heroMetal,
    title: "Цветной металлопрокат",
    subtitle: "",
    description: "Нержавеющая сталь, латунь, медь, алюминий — в наличии и под заказ с доставкой по всему Казахстану и СНГ",
  },
  {
    id: 3,
    image: heroMedical,
    title: "Медицинское оборудование",
    subtitle: "",
    description: "Лидер в поставке медицинского оборудования для клиник и больниц. Только сертифицированная продукция",
  },
];


const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl text-primary-foreground">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              {slides[currentSlide].title}
              {slides[currentSlide].subtitle && (
                <span className="block text-primary">{slides[currentSlide].subtitle}</span>
              )}
            </h1>
            <p 
              className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {slides[currentSlide].description}
            </p>
            <div 
              className="flex flex-wrap gap-4 animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
              onClick={() => navigate("/catalog")}
              variant="hero" size="xl">
                Смотреть каталог
              </Button>
              <Button variant="heroOutline" size="xl">
                Скачать КП
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/20 hover:bg-background/40 rounded-full text-primary-foreground transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/20 hover:bg-background/40 rounded-full text-primary-foreground transition-all backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
