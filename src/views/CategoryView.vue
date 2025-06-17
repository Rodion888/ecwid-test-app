<template>
  <div class="category-page">
    <div v-if="isLoading" class="loader-container">
      <BaseSpinner />
    </div>

    <div v-else-if="category" class="category-container">
      <header class="category-header">
        <div class="category-info">
          <h1>{{ category.name }}</h1>
          <p
            v-if="category.description"
            class="category-description"
            v-html="category.description"
          ></p>
          <div class="category-stats">
            <span class="product-count">{{ category.productCount || 0 }} products</span>
          </div>
        </div>
        <img
          v-if="category.imageUrl"
          :src="category.imageUrl"
          :alt="category.name"
          class="category-image"
        />
      </header>

      <section v-if="hasSubcategories" class="subcategories-section">
        <h2 class="section-title">Subcategories</h2>
        <div class="categories-grid">
          <div
            v-for="subcategory in subcategories"
            :key="subcategory.id"
            class="category-card"
            @click="goToCategory(subcategory.id)"
          >
            <h3>{{ subcategory.name }}</h3>
            <p>{{ subcategory.productCount || 0 }} products</p>
          </div>
        </div>
      </section>

      <section v-if="hasProducts" class="products-section">
        <h2 class="section-title">Products</h2>
        <div class="products-grid">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </section>

      <div v-if="isEmpty" class="empty-state">
        <h3>No products in this category yet</h3>
        <p>Try browsing other categories</p>
        <BaseButton type="btn" text="Back to Catalog" @buttonClick="goToCatalog" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ecwidApi } from '@/services/ecwidApi';
import { BaseButton, BaseSpinner, ProductCard } from '@/components';

import type { EcwidCategory, EcwidProduct } from '@/types/ecwid';

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const category = ref<EcwidCategory | null>(null);
const subcategories = ref<EcwidCategory[]>([]);
const products = ref<EcwidProduct[]>([]);

const hasSubcategories = computed(() => subcategories.value.length > 0);
const hasProducts = computed(() => products.value.length > 0);
const isEmpty = computed(() => !hasSubcategories.value && !hasProducts.value);

const loadCategoryData = async (categoryId: number) => {
  try {
    isLoading.value = true;

    const allCategoriesResponse = await ecwidApi.getCategories();
    category.value = allCategoriesResponse.items.find(cat => cat.id === categoryId) || null;

    if (!category.value) {
      return;
    }

    const [subcategoriesResponse, productsResponse] = await Promise.all([
      ecwidApi.getCategories(categoryId),
      ecwidApi.getProducts(categoryId, 50),
    ]);

    subcategories.value = subcategoriesResponse.items || [];
    products.value = productsResponse.items || [];
  } finally {
    isLoading.value = false;
  }
};

const goToCategory = (categoryId: number) =>
  router.push({
    name: 'category',
    params: { id: categoryId.toString() },
  });

const goToCatalog = () => router.push('/');

watch(
  () => route.params.id,
  newId => {
    if (newId && typeof newId === 'string') {
      loadCategoryData(parseInt(newId));
    }
  },
  { immediate: true }
);

onMounted(() => {
  const id = route.params.id;
  if (id && typeof id === 'string') {
    loadCategoryData(parseInt(id));
  }
});
</script>

<style scoped>
.category-page {
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

.category-container {
  backdrop-filter: blur(10px);
  position: relative;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 86%;
  padding: 2rem;
  height: calc(100% - 6rem);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 12px;
}

.category-container::-webkit-scrollbar {
  display: none;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(30, 30, 30, 0.4);
  border-radius: 12px;
}

.category-info {
  flex: 1;
}

.category-description {
  color: var(--color-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.product-count {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 1.1rem;
}

.category-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.subcategories-section,
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

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(30, 30, 30, 0.4);
  border-radius: 12px;
}

.empty-state h3 {
  color: var(--color-default);
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.empty-state p {
  color: var(--color-secondary);
  margin: 0 0 2rem 0;
  line-height: 1.6;
}
</style>
