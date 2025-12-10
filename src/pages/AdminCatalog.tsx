import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { adminAuth, adminCatalogApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CategoryNode } from "@/types/catalog";
import { slugify } from "@/lib/utils";

type NewProductForm = {
  short_title: string;
  full_title: string;
  description: string;
  url: string;
  small_image: string;
  big_images: string;
  tags: string;
  categoryId: string;
  characteristics: string;
};

type NewCategoryForm = {
  name: string;
  parentId: string;
  image: string;
};

const AdminCatalog = () => {
  const navigate = useNavigate();
  const token = adminAuth.getToken();

  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
  const [editCategoryForm, setEditCategoryForm] = useState<{ name: string; image: string; parentId: string }>({
    name: "",
    image: "",
    parentId: "",
  });
  const [editCategoryError, setEditCategoryError] = useState<string | null>(null);
  const [editCategorySuccess, setEditCategorySuccess] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    short_title: "",
    full_title: "",
    description: "",
    url: "",
    small_image: "",
    big_images: "",
    tags: "",
    categoryId: "",
    characteristics: "",
  });
  const [newCategory, setNewCategory] = useState<NewCategoryForm>({
    name: "",
    parentId: "",
    image: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadAll();
  }, [navigate, token]);

  const loadAll = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const catRes = await adminCatalogApi.getCategoriesTree(token);
      setCategories(catRes.tree || []);
      setCategoryError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof NewProductForm, value: string) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateProduct = async () => {
    if (!token) return navigate("/admin/login");
    if (!newProduct.categoryId) {
      setCreateError("Выберите категорию");
      return;
    }
    setCreateError(null);
    setCreateSuccess(null);
    try {
      const autoSlug =
        newProduct.url?.trim() ||
        slugify(newProduct.short_title || newProduct.full_title || "product");
      const payload = {
        short_title: newProduct.short_title || newProduct.full_title || "Без названия",
        full_title: newProduct.full_title || newProduct.short_title,
        description: newProduct.description,
        url: autoSlug,
        small_image: newProduct.small_image,
        big_images: newProduct.big_images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: newProduct.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        categoryId: newProduct.categoryId,
        characteristics: newProduct.characteristics
          ? Object.fromEntries(
              newProduct.characteristics
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [k, ...rest] = line.split(":");
                  return [k.trim(), rest.join(":").trim()];
                }),
            )
          : undefined,
      };
      const res = await adminCatalogApi.createProduct(token, payload);
      setCreateSuccess("Товар создан");
      setNewProduct({
        short_title: "",
        full_title: "",
        description: "",
        url: "",
        small_image: "",
        big_images: "",
        tags: "",
        categoryId: "",
        characteristics: "",
      });
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Не удалось создать товар");
    }
  };

  const tokenShort = useMemo(() => token?.slice(0, 8) + "..." + token?.slice(-6), [token]);

  const flattenCategories = (nodes: CategoryNode[], depth = 0): { id: string; label: string }[] => {
    return nodes.flatMap((node) => [
      { id: node._id, label: `${"— ".repeat(depth)}${node.name}` },
      ...(node.children ? flattenCategories(node.children, depth + 1) : []),
    ]);
  };

  const categoryOptions = flattenCategories(categories);

  const handleCategoryField = (field: keyof NewCategoryForm, value: string) => {
    setNewCategory((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateCategory = async () => {
    if (!token) return navigate("/admin/login");
    setCategoryError(null);
    setCategorySuccess(null);
    const name = newCategory.name.trim();
    const parentId = newCategory.parentId || null;
    const image = newCategory.image.trim();
    if (!name) {
      setCategoryError("Введите название категории");
      return;
    }
    if (!parentId) {
      setCategoryError("Выберите родительскую категорию");
      return;
    }
    try {
      await adminCatalogApi.createCategory(token, {
        name,
        slug: slugify(name),
        parentId,
        image: image || undefined,
      });
      setNewCategory({ name: "", parentId: "", image: "" });
      setCategorySuccess("Категория создана");
      await loadAll();
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : "Не удалось создать категорию");
    }
  };

  const handleEditCategory = (category: CategoryNode) => {
    setEditingCategory(category);
    setEditCategoryForm({
      name: category.name,
      image: category.image || "",
      parentId: category.parentId || "",
    });
    setEditCategoryError(null);
    setEditCategorySuccess(null);
  };

  const handleUpdateCategory = async () => {
    if (!token || !editingCategory) return;
    setEditCategoryError(null);
    setEditCategorySuccess(null);
    const name = editCategoryForm.name.trim();
    if (!name) {
      setEditCategoryError("Введите название категории");
      return;
    }
    try {
      await adminCatalogApi.updateCategory(token, editingCategory._id, {
        name,
        slug: slugify(name),
        image: editCategoryForm.image.trim() || undefined,
        parentId: editCategoryForm.parentId || null,
      });
      setEditCategorySuccess("Категория обновлена");
      setEditingCategory(null);
      await loadAll();
    } catch (err) {
      setEditCategoryError(err instanceof Error ? err.message : "Не удалось обновить категорию");
    }
  };

  const handleDeleteCategory = async (category: CategoryNode) => {
    if (!token) return;
    if (!confirm(`Удалить категорию "${category.name}"? Это действие нельзя отменить.`)) {
      return;
    }
    try {
      await adminCatalogApi.deleteCategory(token, category._id);
      setCategorySuccess("Категория удалена");
      await loadAll();
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : "Не удалось удалить категорию");
    }
  };

  const renderCategoryTree = (nodes: CategoryNode[]) => (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node._id} className="rounded border border-border/50 bg-background/70 px-3 py-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex-1">
              <div className="font-semibold text-foreground">{node.name}</div>
              <div className="text-xs text-muted-foreground">/{node.slug}</div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditCategory(node)}
                className="h-7 w-7 p-0"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCategory(node)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {node.children && node.children.length > 0 && (
            <div className="mt-2 border-l border-border/40 pl-3">{renderCategoryTree(node.children)}</div>
          )}
        </li>
      ))}
    </ul>
  );

  if (!token) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Админ-панель каталога</p>
            <h1 className="text-2xl font-bold text-foreground">Каталог</h1>
          </div>
          <div className="flex items-center gap-2">
            {token && <Badge variant="outline">JWT: {tokenShort}</Badge>}
            <Button variant="outline" onClick={() => navigate("/admin/products")}>
              Управление товарами
            </Button>
            <Button variant="outline" onClick={() => { adminAuth.clearToken(); navigate("/admin/login"); }}>
              Выйти
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Категории (6 направлений)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Название категории"
                value={newCategory.name}
                onChange={(e) => handleCategoryField("name", e.target.value)}
              />
              <Input
                placeholder="Фото (URL, опционально)"
                value={newCategory.image}
                onChange={(e) => handleCategoryField("image", e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">Родитель (обязателен)</label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={newCategory.parentId}
                  onChange={(e) => handleCategoryField("parentId", e.target.value)}
                >
                  <option value="">Выберите родителя</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {categoryError && (
              <Alert variant="destructive">
                <AlertDescription>{categoryError}</AlertDescription>
              </Alert>
            )}
            {categorySuccess && (
              <Alert className="border border-primary/30 bg-primary/5 text-primary">
                <AlertDescription>{categorySuccess}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleCreateCategory}>Создать категорию</Button>

            <div className="max-h-[400px] overflow-auto rounded-md border border-border/60 bg-card/60 p-3">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Категорий пока нет</p>
              ) : (
                renderCategoryTree(categories)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Добавить товар</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Короткое название"
                value={newProduct.short_title}
                onChange={(e) => handleChange("short_title", e.target.value)}
              />
              <Input
                placeholder="Полное название"
                value={newProduct.full_title}
                onChange={(e) => handleChange("full_title", e.target.value)}
              />
              <Input
                placeholder="URL (catalog/slug)"
                value={newProduct.url}
                onChange={(e) => handleChange("url", e.target.value)}
              />
              <Input
                placeholder="Маленькое изображение URL"
                value={newProduct.small_image}
                onChange={(e) => handleChange("small_image", e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">Категория (обязательна)</label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={newProduct.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                >
                  <option value="">Выберите категорию</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                placeholder="Теги (через запятую)"
                value={newProduct.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
              />
              <Input
                placeholder="Большие изображения (через запятую)"
                value={newProduct.big_images}
                onChange={(e) => handleChange("big_images", e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Описание"
              value={newProduct.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <Textarea
              placeholder="Характеристики (каждая строка: Ключ: Значение)"
              value={newProduct.characteristics}
              onChange={(e) => handleChange("characteristics", e.target.value)}
            />

            {createError && (
              <Alert variant="destructive">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
            {createSuccess && (
              <Alert className="border border-primary/30 bg-primary/5 text-primary">
                <AlertDescription>{createSuccess}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleCreateProduct}>Создать товар</Button>
          </CardContent>
        </Card>

        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать категорию</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название категории</label>
                <Input
                  value={editCategoryForm.name}
                  onChange={(e) => setEditCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Название категории"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Фото (URL, опционально)</label>
                <Input
                  value={editCategoryForm.image}
                  onChange={(e) => setEditCategoryForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="Фото (URL, опционально)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Родительская категория</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={editCategoryForm.parentId}
                  onChange={(e) => setEditCategoryForm((prev) => ({ ...prev, parentId: e.target.value }))}
                >
                  <option value="">Корневая категория</option>
                  {categoryOptions
                    .filter((opt) => opt.id !== editingCategory?._id)
                    .map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              </div>
              {editCategoryError && (
                <Alert variant="destructive">
                  <AlertDescription>{editCategoryError}</AlertDescription>
                </Alert>
              )}
              {editCategorySuccess && (
                <Alert className="border border-primary/30 bg-primary/5 text-primary">
                  <AlertDescription>{editCategorySuccess}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Отмена
                </Button>
                <Button onClick={handleUpdateCategory}>Сохранить</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCatalog;

