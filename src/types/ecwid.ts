export interface EcwidCategory {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  productCount?: number;
}

export interface EcwidProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  compareToPrice?: number;
  imageUrl?: string;
  galleryImages?: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
}

export interface EcwidCategoriesResponse {
  total: number;
  count: number;
  offset: number;
  limit: number;
  items: EcwidCategory[];
}

export interface EcwidProductsResponse {
  total: number;
  count: number;
  offset: number;
  limit: number;
  items: EcwidProduct[];
}

export interface CartItem {
  product: EcwidProduct;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  total: number;
}