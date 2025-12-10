import { ApiProduct, CategoryNode } from "@/types/catalog";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const TOKEN_KEY = "admin_token";

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ошибка запроса (${res.status})`);
  }
  return res.json();
};

export const adminAuth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  async requestOtp(email: string) {
    return handleResponse<{ success: boolean }>(
      await fetch(`${API_BASE}/admin/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }),
    );
  },
  async verifyOtp(email: string, code: string, password: string) {
    return handleResponse<{ success: boolean; token: string; expiresIn: number; user: { email: string } }>(
      await fetch(`${API_BASE}/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      }),
    );
  },
};

type AdminProductPayload = {
  short_title: string;
  full_title?: string;
  description?: string;
  small_image?: string;
  big_images?: string[];
  tags?: string[];
  url?: string;
  categoryId: string;
  characteristics?: Record<string, string>;
};

type AdminProductUpdatePayload = Partial<AdminProductPayload>;

type AdminCategoryPayload = {
  name: string;
  slug?: string;
  parentId?: string | null;
  order?: number;
  image?: string;
};

export const adminCatalogApi = {
  async getProducts(token: string, page = 1, limit = 20, q = "") {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      q,
    });
    return handleResponse<{
      success: boolean;
      page: number;
      total: number;
      totalPages: number;
      products: ApiProduct[];
    }>(
      await fetch(`${API_BASE}/admin/products?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  },

  async createProduct(token: string, payload: AdminProductPayload) {
    return handleResponse<{ success: boolean; product: ApiProduct }>(
      await fetch(`${API_BASE}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }),
    );
  },

  async deleteProduct(token: string, id: string) {
    return handleResponse<{ success: boolean }>(
      await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  },

  async updateProduct(token: string, id: string, payload: AdminProductUpdatePayload) {
    return handleResponse<{ success: boolean; product: ApiProduct }>(
      await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }),
    );
  },

  async getCategoriesTree(token: string) {
    return handleResponse<{ success: boolean; tree: CategoryNode[] }>(
      await fetch(`${API_BASE}/admin/categories/tree`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
  },

  async createCategory(token: string, payload: AdminCategoryPayload) {
    return handleResponse<{ success: boolean; category: CategoryNode }>(
      await fetch(`${API_BASE}/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }),
    );
  },

  async updateCategory(token: string, id: string, payload: Partial<AdminCategoryPayload>) {
    return handleResponse<{ success: boolean; category: CategoryNode }>(
      await fetch(`${API_BASE}/admin/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }),
    );
  },

  async deleteCategory(token: string, id: string) {
    return handleResponse<{ success: boolean }>(
      await fetch(`${API_BASE}/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
  },
};

