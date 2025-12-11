import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogApi } from "@/lib/api";
import { catalogCategories, CatalogCategory as StaticCategory } from "@/data/catalogData";
import { cn, slugify } from "@/lib/utils";
import type { CategoryNode } from "@/types/catalog";

interface CatalogDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

type TreeNode = CategoryNode & { fullSlug: string; children?: TreeNode[] };
type SidebarNode = {
  name: string;
  fullSlug: string;
  children: TreeNode[];
};

const CatalogDropdown = ({ isOpen, onToggle, onClose }: CatalogDropdownProps) => {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [active, setActive] = useState<SidebarNode | null>(null);

  const withPaths = (nodes: CategoryNode[], parent = ""): TreeNode[] =>
    nodes.map((n) => {
      const fullSlug = [parent, n.slug].filter(Boolean).join("/");
      return { ...n, fullSlug, children: n.children ? withPaths(n.children, fullSlug) : [] };
    });

  const fallbackTree = useMemo<TreeNode[]>(() => {
    return catalogCategories.map((cat) => {
      const catSlug = cat.slug ?? slugify(cat.name);
      return {
        _id: catSlug,
        name: cat.name,
        slug: catSlug,
        fullSlug: catSlug,
        children: cat.groups.map((group) => {
          const groupSlug = group.slug ?? slugify(group.title);
          return {
            _id: `${catSlug}-${groupSlug}`,
            name: group.title,
            slug: groupSlug,
            fullSlug: `${catSlug}/${groupSlug}`,
            children: (group.items ?? []).map((item) => {
              const itemSlug = item.slug ?? slugify(item.name);
              return {
                _id: `${catSlug}-${groupSlug}-${itemSlug}`,
                name: item.name,
                slug: itemSlug,
                fullSlug: `${catSlug}/${groupSlug}/${itemSlug}`,
              } as TreeNode;
            }),
          } as TreeNode;
        }),
      } as TreeNode;
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await catalogApi.getCategoryTree().catch(() => ({ tree: [] }));
        const t = withPaths(res.tree || []);
        const finalTree = t.length ? t : fallbackTree;
        setTree(finalTree);
        if (finalTree.length > 0) {
          setActive({
            name: finalTree[0].name,
            fullSlug: finalTree[0].fullSlug,
            children: finalTree[0].children || [],
          });
        }
      } catch {
        const finalTree = fallbackTree;
        setTree(finalTree);
        if (finalTree.length > 0) {
          setActive({
            name: finalTree[0].name,
            fullSlug: finalTree[0].fullSlug,
            children: finalTree[0].children || [],
          });
        }
      }
    };
    load();
  }, [fallbackTree]);

  const sidebarItems: SidebarNode[] = useMemo(() => {
    return tree.map((node) => ({
      name: node.name,
      fullSlug: node.fullSlug,
      children: node.children || [],
    }));
  }, [tree]);

  const renderSubcategories = (nodes: TreeNode[], level = 0) => {
    if (!nodes || nodes.length === 0) return null;
    
    return (
      <ul className={cn("space-y-1", level > 0 && "ml-4 mt-1")}>
        {nodes.map((node) => (
          <li key={node.fullSlug}>
            <Link
              to={`/catalog/${node.fullSlug}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors block"
              onClick={onClose}
            >
              {node.name}
            </Link>
            {node.children && node.children.length > 0 && renderSubcategories(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

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
                {sidebarItems.map((category, idx) => (
                  <button
                    key={`${category.fullSlug}-${idx}`}
                    className={cn(
                      "w-full text-left px-6 py-4 text-sm font-medium transition-colors border-b border-border/50 last:border-b-0 flex items-center justify-between",
                      active?.fullSlug === category.fullSlug
                        ? "text-primary bg-background"
                        : "text-foreground/80 hover:text-primary hover:bg-background/50",
                    )}
                    onMouseEnter={() => setActive(category)}
                  >
                    <span>{category.name}</span>
                    <ChevronRight size={16} className="opacity-50" />
                  </button>
                ))}
              </div>

              {/* Subcategories content */}
              <div className="w-[700px] p-6 bg-background max-h-[500px] overflow-y-auto">
                {active && active.children.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Нет подкатегорий</div>
                ) : (
                <div className="grid grid-cols-3 gap-6">
                    {active?.children.map((child) => (
                      <div key={child.fullSlug}>
                        <Link
                          to={`/catalog/${child.fullSlug}`}
                          className="font-semibold text-foreground mb-2 text-sm block hover:text-primary transition-colors"
                              onClick={onClose}
                            >
                          {child.name}
                        </Link>
                        {child.children && child.children.length > 0 && (
                          <div className="mt-2">
                            {renderSubcategories(child.children)}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CatalogDropdown;
