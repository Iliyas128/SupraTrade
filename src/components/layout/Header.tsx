import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CatalogDropdown from "@/components/CatalogDropdown";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Направления", href: "#directions" },
  { label: "О нас", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Производство", href: "#production" },
  { label: "Новости", href: "#news" },
  { label: "Контакты", href: "#contacts" },
];

interface HeaderProps {
  onCallbackClick: () => void;
}

const Header = ({ onCallbackClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="bg-background sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src="/favicon.ico" alt="SUPRA TRADE" className="w-20 h-10 rounded-lg" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <CatalogDropdown
              isOpen={isCatalogOpen}
              onToggle={() => setIsCatalogOpen(!isCatalogOpen)}
              onClose={() => setIsCatalogOpen(false)}
            />
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-2 text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <div className="relative w-42">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти товар..."
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <Button type="submit" size="sm" className="whitespace-nowrap">
                Искать
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-2">
              <form onSubmit={submitSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Найти товар..."
                    className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button type="submit" size="sm">
                  Искать
                </Button>
              </form>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "px-4 py-3 text-foreground/80 hover:text-primary hover:bg-secondary rounded-lg font-medium transition-all",
                    location.hash === item.href && "text-primary",
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </button>
              ))}
              <Button variant="callback" className="mt-4" onClick={onCallbackClick}>
                Обратный звонок
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
