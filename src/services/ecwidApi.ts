import type { EcwidCategoriesResponse, EcwidProductsResponse, EcwidProduct } from '@/types/ecwid';

const STORE_ID = import.meta.env.VITE_STORE_ID || '108362264';
const PUBLIC_TOKEN = import.meta.env.VITE_PUBLIC_TOKEN || 'public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://app.ecwid.com/api/v3'}/${STORE_ID}`;

class EcwidApiService {
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('token', PUBLIC_TOKEN);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getCategories(parentId?: number): Promise<EcwidCategoriesResponse> {
    const params: Record<string, string> = {
      limit: '100',
    };

    if (parentId !== undefined) {
      params.parent = parentId.toString();
    }

    return this.makeRequest<EcwidCategoriesResponse>('/categories', params);
  }

  async getProducts(categoryId?: number, limit = 20, offset = 0): Promise<EcwidProductsResponse> {
    const params: Record<string, string> = {
      limit: limit.toString(),
      offset: offset.toString(),
      enabled: 'true',
    };

    if (categoryId !== undefined) {
      params.category = categoryId.toString();
    }

    return this.makeRequest<EcwidProductsResponse>('/products', params);
  }

  async getProduct(productId: number): Promise<EcwidProduct> {
    return this.makeRequest<EcwidProduct>(`/products/${productId}`);
  }

  async searchProducts(query: string, limit = 20): Promise<EcwidProductsResponse> {
    const params = {
      keyword: query,
      limit: limit.toString(),
      enabled: 'true',
    };

    return this.makeRequest<EcwidProductsResponse>('/products', params);
  }
}

export const ecwidApi = new EcwidApiService();
