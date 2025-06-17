<template>
  <div class="product-card">
    <div class="product-image-container" @click="goToProduct">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="product-image"
      />
      <div v-else class="product-image-placeholder">No image</div>
    </div>

    <div class="product-info">
      <div class="product-text">
        <h3 class="product-name" @click="goToProduct">{{ product.name }}</h3>
        <p class="product-price">${{ product.price.toFixed(2) }}</p>
      </div>
      <BaseButton @buttonClick="addToCart" text="Buy" class="buy-button" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

import BaseButton from './BaseButton.vue';

import type { EcwidProduct } from '@/types/ecwid';

interface Props {
  product: EcwidProduct;
}

const props = defineProps<Props>();

const router = useRouter();
const cartStore = useCartStore();

const goToProduct = () => {
  router.push({ name: 'product', params: { id: props.product.id.toString() } });
};

const addToCart = () => cartStore.addToCart(props.product);
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image-container {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.product-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.product-text {
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 0.5rem 0;
  color: var(--color-default);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-accent);
  margin: 0.5rem 0 1rem 0;
}

.buy-button {
  width: 60%;
  display: flex;
  align-self: center;
}
</style>
