import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuth, adminCatalogApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CategoryNode } from "@/types/catalog";

const AdminProducts = () => {
  const navigate = useNavigate();
  const token = adminAuth.getToken();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadProducts(page, q);
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, token]);

  const loadProducts = async (p = 1, query = "") => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await adminCatalogApi.getProducts(token, p, 20, query);
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить товары");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    if (!token) return;
    try {
      const res = await adminCatalogApi.getCategoriesTree(token);
      setCategories(res.tree || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return navigate("/admin/login");
    if (!confirm("Удалить товар?")) return;
    try {
      const targetId = (id as any)?.$oid || id;
      await adminCatalogApi.deleteProduct(token, targetId);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Не удалось удалить");
    }
  };

  const tokenShort = useMemo(() => token?.slice(0, 8) + "..." + token?.slice(-6), [token]);

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setPage(1);
    loadProducts(1, q);
  };

  const flattenCategories = (nodes: CategoryNode[], depth = 0): { id: string; label: string }[] => {
    return nodes.flatMap((node) => [
      { id: node._id, label: `${"— ".repeat(depth)}${node.name}` },
      ...(node.children ? flattenCategories(node.children, depth + 1) : []),
    ]);
  };

  const categoryOptions = flattenCategories(categories);

  const openEdit = (product: any) => {
    setSaveError(null);
    setEditing({
      ...product,
      tagsInput: (product.tags || []).join(", "),
      bigImagesInput: (product.bigImages || product.big_images || []).join(", "),
      categoryId:
        product.categoryId ||
        product.category_id ||
        product.categoryPath?.[product.categoryPath.length - 1]?._id ||
        product.categoryPath?.[product.categoryPath.length - 1]?.id ||
        "",
      characteristicsInput: (product.characteristics ||
        (product as any).characteristicsMap ||
        (product as any).attributes ||
        (product as any).specs)
        ? Object.entries(
            product.characteristics ||
              (product as any).characteristicsMap ||
              (product as any).attributes ||
              (product as any).specs,
          )
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : "",
      en_short: product.translations?.en?.short_title || "",
      en_full: product.translations?.en?.full_title || "",
      en_desc: product.translations?.en?.description || "",
      en_tagsInput: (product.translations?.en?.tags || []).join(", "),
      en_charsInput: product.translations?.en?.characteristics
        ? Object.entries(product.translations.en.characteristics)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : "",
      zh_short: product.translations?.zh?.short_title || "",
      zh_full: product.translations?.zh?.full_title || "",
      zh_desc: product.translations?.zh?.description || "",
      zh_tagsInput: (product.translations?.zh?.tags || []).join(", "),
      zh_charsInput: product.translations?.zh?.characteristics
        ? Object.entries(product.translations.zh.characteristics)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : "",
    });
  };

  const handleEditField = (field: string, value: string) => {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    if (!token || !editing) return;
    if (!editing.categoryId) {
      setSaveError("Выберите категорию");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const buildTags = (input?: string) =>
        (input || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      const buildChars = (input?: string) =>
        input
          ? Object.fromEntries(
              (input as string)
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [k, ...rest] = line.split(":");
                  return [k.trim(), rest.join(":").trim()];
                }),
            )
          : undefined;
      const translations: any = {};
      if (editing.en_short || editing.en_full || editing.en_desc || editing.en_tagsInput || editing.en_charsInput) {
        translations.en = {
          short_title: editing.en_short || undefined,
          full_title: editing.en_full || undefined,
          description: editing.en_desc || undefined,
          tags: buildTags(editing.en_tagsInput),
          characteristics: buildChars(editing.en_charsInput),
        };
      }
      if (editing.zh_short || editing.zh_full || editing.zh_desc || editing.zh_tagsInput || editing.zh_charsInput) {
        translations.zh = {
          short_title: editing.zh_short || undefined,
          full_title: editing.zh_full || undefined,
          description: editing.zh_desc || undefined,
          tags: buildTags(editing.zh_tagsInput),
          characteristics: buildChars(editing.zh_charsInput),
        };
      }
      const payload: any = {
        short_title: editing.short_title || editing.shortTitle,
        full_title: editing.full_title || editing.fullTitle,
        description: editing.description,
        small_image: editing.small_image || editing.smallImage,
        big_images: buildTags(editing.bigImagesInput as string),
        tags: buildTags(editing.tagsInput as string),
        url: editing.url,
        categoryId: editing.categoryId,
        characteristics: buildChars(editing.characteristicsInput),
        translations: Object.keys(translations).length ? translations : undefined,
      };
      const targetId = (editing._id as any)?.$oid || editing._id || editing.id;
      const res = await adminCatalogApi.updateProduct(token, targetId, payload);
      setProducts((prev) =>
        prev.map((p) => (p.id === targetId || p._id === targetId ? res.product : p)),
      );
      setEditing(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Админ-панель каталога</p>
            <h1 className="text-2xl font-bold text-foreground">Товары: управление</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {token && <Badge variant="outline" className="w-full sm:w-auto text-left">JWT: {tokenShort}</Badge>}
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/admin/catalog")}>
              Создание
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                adminAuth.clearToken();
                navigate("/admin/login");
              }}
            >
              Выйти
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Поиск и список товаров</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={onSearch} className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Поиск по названию, тегам, URL"
                className="w-full md:w-80"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button type="submit" className="w-full sm:w-auto">Искать</Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  setQ("");
                  onSearch();
                }}
              >
                Сброс
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => loadProducts(page, q)}
              >
                Обновить
              </Button>
            </form>

            {loading ? (
              <p>Загружаем...</p>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground">Ничего не найдено</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Полный URL</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id || product._id}>
                        <TableCell className="font-semibold">{product.shortTitle || product.short_title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{product.url}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.fullUrl || product.full_url || ""}
                        </TableCell>
                        <TableCell className="text-sm">
                          {(product.categories || product.categoryPath || []).map((c: any) => c.name).join(", ")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {(product.fullUrl || product.full_url) && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  const target = `/product${(product.fullUrl || product.full_url || "").replace(/^\/?product\//, "")}`;
                                  window.open(target, "_blank");
                                }}
                              >
                                Открыть
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                              Редакт.
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product.id || product._id)}
                            >
                              Удалить
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    loadProducts(page - 1, q);
                  }}
                >
                  Назад
                </Button>
                <span className="text-sm text-muted-foreground">
                  Страница {page} из {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    loadProducts(page + 1, q);
                  }}
                >
                  Далее
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Редактирование товара</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Короткое название"
                    value={editing.short_title || editing.shortTitle || ""}
                    onChange={(e) => handleEditField("short_title", e.target.value)}
                  />
                  <Input
                    placeholder="Полное название"
                    value={editing.full_title || editing.fullTitle || ""}
                    onChange={(e) => handleEditField("full_title", e.target.value)}
                  />
                <Input
                  placeholder="Короткое название (EN)"
                  value={editing.en_short || ""}
                  onChange={(e) => handleEditField("en_short", e.target.value)}
                />
                <Input
                  placeholder="Полное название (EN)"
                  value={editing.en_full || ""}
                  onChange={(e) => handleEditField("en_full", e.target.value)}
                />
                <Input
                  placeholder="Короткое название (ZH)"
                  value={editing.zh_short || ""}
                  onChange={(e) => handleEditField("zh_short", e.target.value)}
                />
                <Input
                  placeholder="Полное название (ZH)"
                  value={editing.zh_full || ""}
                  onChange={(e) => handleEditField("zh_full", e.target.value)}
                />
                  <Input
                    placeholder="URL"
                    value={editing.url || ""}
                    onChange={(e) => handleEditField("url", e.target.value)}
                  />
                  <Input
                    placeholder="Маленькое изображение URL"
                    value={editing.small_image || editing.smallImage || ""}
                    onChange={(e) => handleEditField("small_image", e.target.value)}
                  />
                  <Input
                    placeholder="Большие изображения (через запятую)"
                    value={editing.bigImagesInput || ""}
                    onChange={(e) => handleEditField("bigImagesInput", e.target.value)}
                  />
                  <Input
                    placeholder="Теги (через запятую)"
                    value={editing.tagsInput || ""}
                    onChange={(e) => handleEditField("tagsInput", e.target.value)}
                  />
                <Input
                  placeholder="Теги (EN, через запятую)"
                  value={editing.en_tagsInput || ""}
                  onChange={(e) => handleEditField("en_tagsInput", e.target.value)}
                />
                <Input
                  placeholder="Теги (ZH, через запятую)"
                  value={editing.zh_tagsInput || ""}
                  onChange={(e) => handleEditField("zh_tagsInput", e.target.value)}
                />
                </div>
                <Textarea
                  placeholder="Описание"
                  value={editing.description || ""}
                  onChange={(e) => handleEditField("description", e.target.value)}
                />
                <Textarea
                  placeholder="Описание (EN)"
                  value={editing.en_desc || ""}
                  onChange={(e) => handleEditField("en_desc", e.target.value)}
                />
                <Textarea
                  placeholder="Описание (ZH)"
                  value={editing.zh_desc || ""}
                  onChange={(e) => handleEditField("zh_desc", e.target.value)}
                />
                <Textarea
                  placeholder="Характеристики (каждая строка: Ключ: Значение)"
                  value={editing.characteristicsInput || ""}
                  onChange={(e) => handleEditField("characteristicsInput", e.target.value)}
                />
                <Textarea
                  placeholder="Характеристики (EN, Key: Value)"
                  value={editing.en_charsInput || ""}
                  onChange={(e) => handleEditField("en_charsInput", e.target.value)}
                />
                <Textarea
                  placeholder="Характеристики (ZH, Key: Value)"
                  value={editing.zh_charsInput || ""}
                  onChange={(e) => handleEditField("zh_charsInput", e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Категория</label>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={editing.categoryId || ""}
                    onChange={(e) => handleEditField("categoryId", e.target.value)}
                  >
                    <option value="">Выберите категорию</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {saveError && (
                  <Alert variant="destructive">
                    <AlertDescription>{saveError}</AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="w-full sm:w-auto" disabled={saving} onClick={saveEdit}>
                    Сохранить
                  </Button>
                  <Button className="w-full sm:w-auto" variant="ghost" onClick={() => setEditing(null)}>
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminProducts;

