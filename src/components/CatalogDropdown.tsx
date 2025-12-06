import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogCategories, CatalogCategory } from "@/data/catalogData";
import { cn } from "@/lib/utils";

interface CatalogDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const CatalogDropdown = ({ isOpen, onToggle, onClose }: CatalogDropdownProps) => {
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>(catalogCategories[0]);

  return (
    <div className="relative">
      <Button variant="catalog" onClick={onToggle} className="flex items-center gap-2">
        <Menu size={18} />
        <span>Каталог</span>
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute left-0 top-full mt-2 z-50 bg-background border border-border rounded-xl shadow-custom-lg overflow-hidden animate-fade-in">
            <div className="flex">
              {/* Categories sidebar */}
              <div className="w-72 border-r border-border bg-muted/30">
                {catalogCategories.map((category) => (
                  <button
                    key={category.slug ?? category.id}
                    className={cn(
                      "w-full text-left px-6 py-4 text-sm font-medium transition-colors border-b border-border/50 last:border-b-0 flex items-center justify-between",
                      activeCategory.slug === category.slug
                        ? "text-primary bg-background"
                        : "text-foreground/80 hover:text-primary hover:bg-background/50",
                    )}
                    onMouseEnter={() => setActiveCategory(category)}
                  >
                    <span>{category.name}</span>
                    <ChevronRight size={16} className="opacity-50" />
                  </button>
                ))}
              </div>

              {/* Subcategories content */}
              <div className="w-[700px] p-6 bg-background max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-6">
                  {activeCategory.groups.map((group, idx) => (
                    <div key={`${activeCategory.slug}-${group.slug ?? idx}`}>
                      <h4 className="font-semibold text-foreground mb-3 text-sm">{group.title}</h4>
                      <ul className="space-y-2">
                        {group.items.map((item, itemIdx) => (
                          <li key={`${group.slug ?? itemIdx}-${item.slug ?? itemIdx}`}>
                            <Link
                              to={`/catalog/${activeCategory.slug}/${item.slug ?? item.name}`}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={onClose}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CatalogDropdown;
