<template>
  <div class="catalog-page">

    <div v-if="isLoading" class="loader-container">
      <BaseSpinner />
    </div>
    
    <div v-else class="catalog-container">
      <section v-if="hasCategories" class="categories-section">
        <h2 class="section-title">Categories</h2>
        <div class="categories-grid">
          <div
            v-for="category in mainCategories"
            :key="category.id"
            class="category-card"
            @click="goToCategory(category.id)">
            <h3>{{ category.name }}</h3>
            <p>{{ category.productCount || 0 }} products</p>
          </div>
        </div>
      </section>
      
      <section v-if="hasProducts" class="products-section">
        <h2 class="section-title">Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ecwidApi } from '@/services/ecwidApi';
import { BaseSpinner, ProductCard } from '@/components';

import type { EcwidProduct, EcwidCategory } from '@/types/ecwid';

const router = useRouter();

const isLoading = ref(true);
const products = ref<EcwidProduct[]>([]);
const categories = ref<EcwidCategory[]>([]);

const mainCategories = computed(() => 
  categories.value.filter(cat => !cat.parentId)
);

const hasCategories = computed(() => mainCategories.value.length > 0);
const hasProducts = computed(() => products.value.length > 0);

const loadCatalogData = async () => {
  try {
    isLoading.value = true;
    
    const [categoriesResponse, productsResponse] = await Promise.all([
      ecwidApi.getCategories(),
      ecwidApi.getProducts()
    ]);
    
    categories.value = categoriesResponse.items || [];
    products.value = productsResponse.items || [];
    
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
    
  } catch (err) {
    console.error('Failed to load catalog data:', err);
    isLoading.value = false;
  }
};

const goToCategory = (categoryId: number) => router.push(`/category/${categoryId}`);

onMounted(() => {
  loadCatalogData();
});
</script>

<style scoped>
.catalog-page {
  width: 100%;
  height: 100%;
  position: relative;
}

.loader-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
}

.catalog-container {
  backdrop-filter: blur(10px);
  position: relative;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 72.6%;
  padding: 1rem;
  height: calc(100% - 6rem);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 12px;
}

.catalog-container::-webkit-scrollbar {
  display: none;
}

.categories-section,
.products-section {
  margin-bottom: 2rem;
}

.section-title {
  color: var(--color-default);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.category-card {
  background: rgba(30, 30, 30, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  background: rgba(30, 30, 30, 0.6);
  transform: translateY(-2px);
}

.category-card h3 {
  color: var(--color-default);
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.category-card p {
  color: var(--color-accent);
  margin: 0;
  font-size: 0.9rem;
}
</style>
