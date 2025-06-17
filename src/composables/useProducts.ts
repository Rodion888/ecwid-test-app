import { ref, readonly } from 'vue';
import { ecwidApi } from '@/services/ecwidApi';

import type { EcwidProduct, EcwidProductsResponse } from '@/types/ecwid';

export function useProducts() {
  const products = ref<EcwidProduct[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);

  const fetchProducts = async (categoryId?: number, limit = 20, offset = 0) => {
    try {
      loading.value = true;
      error.value = null;

      const response: EcwidProductsResponse = await ecwidApi.getProducts(categoryId, limit, offset);

      if (offset === 0) {
        products.value = response.items;
      } else {
        products.value.push(...response.items);
      }

      total.value = response.total;
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      loading.value = false;
    }
  };

  const searchProducts = async (query: string, limit = 20) => {
    try {
      loading.value = true;
      error.value = null;

      const response: EcwidProductsResponse = await ecwidApi.searchProducts(query, limit);
      products.value = response.items;
      total.value = response.total;
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      loading.value = false;
    }
  };

  const getProduct = async (productId: number) => {
    try {
      loading.value = true;
      error.value = null;

      return await ecwidApi.getProduct(productId);
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearProducts = () => {
    products.value = [];
    total.value = 0;
    error.value = null;
  };

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    total: readonly(total),
    fetchProducts,
    searchProducts,
    getProduct,
    clearProducts,
  };
}
