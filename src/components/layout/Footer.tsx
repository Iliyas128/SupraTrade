import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, ChevronRight, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { catalogApi } from "@/lib/api";
import { catalogCategories } from "@/data/catalogData";
import { slugify } from "@/lib/utils";

interface CategoryLink {
  name: string;
  slug: string;
}

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryLink[]>([]);

  // Загружаем реальные категории из API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await catalogApi.getCategoryTree();
        if (res.tree && res.tree.length > 0) {
          // Берём первые 5 родительских категорий из API
          const apiCategories = res.tree.slice(0, 5).map((cat: any) => ({
            name: cat.name,
            slug: cat.slug,
          }));
          setCategories(apiCategories);
        } else {
          // Fallback на локальные данные
          setCategories(
            catalogCategories.slice(0, 5).map((cat) => ({
              name: cat.name,
              slug: cat.slug ?? slugify(cat.name),
            }))
          );
        }
      } catch {
        // Fallback на локальные данные при ошибке
        setCategories(
          catalogCategories.slice(0, 5).map((cat) => ({
            name: cat.name,
            slug: cat.slug ?? slugify(cat.name),
          }))
        );
      }
    };
    loadCategories();
  }, []);

  // Переход со скроллом наверх
  const handleNavigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(path);
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Основной контент */}
      <div className="relative container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          
          {/* Логотип и описание */}
          <div>
            <button 
              onClick={() => handleNavigate("/")} 
              className="inline-flex items-center gap-3 mb-5 group"
            >
              <div className="w-11 h-11 flex items-center justify-center transition-colors">
                <img src="/favicon.ico" alt="SUPRA TRADE" className="w-11 h-8" />
              </div>
              <div className="flex items-baseline">
                <span className="text-primary font-bold text-xl tracking-tight">SUPRA</span>
                <span className="text-white font-bold text-xl ml-1.5 tracking-tight">TRADE</span>
              </div>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t("footer.aboutText")}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="mailto:sales@supratrade.kz" 
                className="w-10 h-10 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:border-primary/50"
                aria-label="Email"
              >
                <Mail size={18} className="text-slate-300" />
              </a>
              <a 
                href="tel:+77083767189" 
                className="w-10 h-10 bg-white/5 hover:bg-primary/20 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:border-primary/50"
                aria-label="Телефон"
              >
                <Phone size={18} className="text-slate-300" />
              </a>
              <a 
                href="https://wa.me/77083767189" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-emerald-500/20 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:border-emerald-500/50"
                aria-label="WhatsApp"
              >
                <Send size={18} className="text-slate-300" />
              </a>
            </div>
          </div>

          {/* Каталог (динамический из API) */}
          <div>
            <h3 className="font-semibold text-white text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full" />
              {t("footer.catalog")}
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button 
                    onClick={() => handleNavigate(`/catalog/${cat.slug}`)}
                    className="group flex items-center text-slate-400 hover:text-white text-sm transition-colors w-full text-left"
                  >
                    <ChevronRight size={14} className="mr-1.5 text-slate-600 group-hover:text-primary transition-colors flex-shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => handleNavigate("/catalog")}
                  className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium mt-1 transition-colors"
                >
                  {t("footer.allDirections")}
                  <ChevronRight size={14} className="ml-0.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-semibold text-white text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full" />
              {t("footer.contacts")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={15} className="text-primary" />
                </div>
                <span className="text-slate-400 text-sm leading-relaxed">
                  {t("footer.address")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-primary" />
                </div>
                <a 
                  href="tel:+77083767189" 
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  +7 708 376 71 89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-primary" />
                </div>
                <a 
                  href="mailto:sales@supratrade.kz" 
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  sales@supratrade.kz
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={15} className="text-primary" />
                </div>
                <div className="text-slate-400 text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                  {t("footer.worktime")}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Разделитель */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} SUPRA TRADE. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <button 
              onClick={() => handleNavigate("/about")} 
              className="hover:text-slate-300 transition-colors"
            >
              {t("nav.about")}
            </button>
            <button 
              onClick={() => handleNavigate("/catalog")} 
              className="hover:text-slate-300 transition-colors"
            >
              {t("footer.catalog")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
