import { Building2, Target, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] bg-hero-gradient overflow-hidden">
      {/* Кнопка "Назад на главную" */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          asChild
          variant="ghost"
          className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Назад на главную
          </Link>
        </Button>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <pattern id="diagonals" width="60" height="60" patternUnits="userSpaceOnUse">
            <line
              x1="0"
              y1="60"
              x2="60"
              y2="0"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary-foreground"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#diagonals)" />
        </svg>
      </div>

      <div className="container-custom relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-8 animate-fade-up">
            <Building2 className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">О компании</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up delay-100">
            Комплексные решения для вашего бизнеса
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto animate-fade-up delay-200">
            Обеспечиваем предприятия комплексными решениями в сфере снабжения, производства и подбора промышленной продукции.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-up delay-300">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Target className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground font-medium">Точность поставок</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground font-medium">Гарантия качества</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


