export interface ProductCategory {
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: string;
  shortTitle: string;
  description: string;
  smallImage: string;
  categories: ProductCategory[];
  url: string;
  fullUrl: string;
}

export interface ApiProductListResponse {
  success: boolean;
  products: ApiProduct[];
  count?: number;
  total?: number;
  totalPages?: number;
  page?: number;
}

export interface ApiCategoryGroup {
  name: string;
  slug: string | null;
  subcategories: ProductCategory[];
}

export interface CategoriesResponse {
  success: boolean;
  mainCategories: Record<string, ApiCategoryGroup>;
  allCategories: ProductCategory[];
}

export interface DetailedProduct extends ApiProduct {
  bigImages?: string[];
  fullTitle?: string;
  characteristics?: Record<string, string>;
  tags?: string[];
  description?: string;
}

