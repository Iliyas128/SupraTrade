import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CatalogDropdown from "@/components/CatalogDropdown";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "@/components/languageSwitcher";

interface HeaderProps {
  onCallbackClick: () => void;
}

const Header = ({ onCallbackClick }: HeaderProps) => {
  const { t, i18n } = useTranslation(); // СНАЧАЛА вызываем хук
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ПОТОМ определяем navItems ВНУТРИ компонента ПОСЛЕ хуков
  const navItems = [
    { label: t("nav.directions"), href: "#directions" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.contacts"), href: "#contacts" },
  ];

  const handleNavClick = (href: string) => {
    const hash = href.startsWith("#") ? href : `#${href}`;

    if (location.pathname !== "/") {
      navigate(`/${hash}`);
    } else {
      const targetId = hash.replace("#", "");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = hash;
      }
    }

    setIsMenuOpen(false);
    setIsCatalogOpen(false);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;
    navigate(`/catalog?q=${encodeURIComponent(value)}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-border">
      <div className="container-custom px-1 py-2">
        {/* Мобильная верхняя полоса */}
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Настольная полоса навигации + поиск */}
        <div className="hidden lg:flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <CatalogDropdown
              isOpen={isCatalogOpen}
              onToggle={() => setIsCatalogOpen(!isCatalogOpen)}
              onClose={() => setIsCatalogOpen(false)}
              key={i18n.language}
            />
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-2 text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Button type="submit" size="sm" className="whitespace-nowrap">
              {t("buttons.search")}
            </Button>
            <LanguageSwitcher />
          </form>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-3">
              <form onSubmit={submitSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search.placeholder")}
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button type="submit" size="sm" variant="outline" className="px-3">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <LanguageSwitcher />

              {navItems.map((item) => (
                <button
                  key={item.href}
                  className={cn(
                    "px-4 py-3 text-foreground/80 hover:text-primary hover:bg-secondary rounded-lg font-medium transition-all",
                    location.hash === item.href && "text-primary",
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;