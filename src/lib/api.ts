import type {
  ApiCategoryGroup,
  ApiProduct,
  ApiProductListResponse,
  CategoriesResponse,
  DetailedProduct,
} from "@/types/catalog";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

const mapProduct = (product: any): ApiProduct => {
  const id =
    typeof product._id === "string"
      ? product._id
      : typeof product._id === "object" && product._id !== null && "$oid" in product._id
        ? product._id.$oid
        : crypto.randomUUID();

  return {
    id,
    shortTitle: product.short_title ?? product.full_title ?? product.name ?? "Без названия",
    description: product.description ?? "",
    smallImage: product.small_image ?? product.big_images?.[0] ?? "",
    categories: product.categories ?? [],
    url: product.url ?? "",
    fullUrl: product.fullUrl ?? `/catalog/${product.url?.replace(/^catalog\//, "") ?? ""}`,
  };
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Ошибка запроса (${res.status})`);
  }
  return res.json();
};

export const catalogApi = {
  async getRandomProducts(): Promise<ApiProduct[]> {
    const res = await handleResponse<{ success: boolean; products: any[] }>(
      await fetch(`${API_BASE}/products/random`),
    );
    if (!res.success) {
      throw new Error("Не удалось получить товары");
    }
    return res.products.map(mapProduct);
  },

  async getCategories(): Promise<ApiCategoryGroup[]> {
    const res = await handleResponse<CategoriesResponse>(await fetch(`${API_BASE}/categories`));
    if (!res.success) {
      throw new Error("Не удалось получить категории");
    }
    return Object.values(res.mainCategories);
  },

  async getProductsByCategory(slug: string, page = 1, limit = 15): Promise<ApiProductListResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const res = await handleResponse<any>(
      await fetch(`${API_BASE}/products/category/${slug}?${params.toString()}`),
    );
    if (!res.success) {
      throw new Error("Не удалось получить товары категории");
    }
    return {
      success: true,
      products: (res.products ?? []).map(mapProduct),
      count: res.count,
      total: res.total,
      totalPages: res.totalPages,
      page: res.page,
    };
  },

  async searchProducts(query: string, page = 1, limit = 15): Promise<ApiProductListResponse> {
    const params = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
    const res = await handleResponse<any>(
      await fetch(`${API_BASE}/products/search?${params.toString()}`),
    );
    if (!res.success) {
      throw new Error("Ошибка поиска товаров");
    }
    return {
      success: true,
      products: (res.products ?? []).map(mapProduct),
      count: res.count,
      total: res.total,
      totalPages: res.totalPages,
      page: res.page,
    };
  },

  async getProductByPath(path: string): Promise<DetailedProduct> {
    const trimmedPath = path.replace(/^catalog\//, "");
    const res = await handleResponse<{ success: boolean; product: any }>(
      await fetch(`${API_BASE}/products/by-url/${trimmedPath}`),
    );
    if (!res.success) {
      throw new Error("Товар не найден");
    }
    const product = mapProduct(res.product);
    return {
      ...product,
      bigImages: res.product.big_images ?? [],
      fullTitle: res.product.full_title ?? product.shortTitle,
      characteristics: res.product.characteristics ?? {},
      tags: res.product.tags ?? [],
      description: res.product.description ?? product.description,
    };
  },
};



