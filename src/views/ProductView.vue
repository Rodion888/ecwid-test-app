<template>
  <div v-if="isLoading" class="loader-container">
    <BaseSpinner />
  </div>

  <div v-if="product && !isLoading" class="product-container">
    <div class="image-section"
      :class="{
        'animate-in': showLeftContent,
        'hidden': !showLeftContent
      }">
      <div class="image-carousel">
        <BaseButton 
          v-if="hasMultipleImages"
          type="arrow-left"
          class="nav-button nav-button-left"
          @buttonClick="previousImage"
        />
        <BaseButton 
          v-if="hasMultipleImages"
          type="arrow-right"
          class="nav-button nav-button-right"
          @buttonClick="nextImage"
        />
        <img 
          :src="currentImage" 
          :alt="product.name" 
          class="product-image" 
          @click="openFullscreen"
        />
        <div v-if="hasMultipleImages" class="image-indicators">
          <button
            v-for="(image, index) in productImages"
            :key="index"
            class="indicator"
            :class="{ active: currentImageIndex === index }"
            @click="setCurrentImage(index)"
          />
        </div>
      </div>
    </div>

    <div 
      class="product-details"
      :class="{
        'animate-in': showRightContent,
        'hidden': !showRightContent
      }">
      <h1 class="product-name">{{ product.name }}</h1>
      <div class="price-section">
        <span class="current-price">${{ product.price.toFixed(2) }}</span>
        <span v-if="hasComparePrice" class="old-price">
          ${{ product.compareToPrice!.toFixed(2) }}
        </span>
      </div>
      <div v-if="product.description" class="product-description">
        <h3>Description</h3>
        <div v-html="product.description"></div>
      </div>
      <div class="buy-button-container">
        <BaseButton
          type="btn"
          class="buy-button"
          text="Buy"
          @buttonClick="addToCart"
        />
      </div>
    </div>
  </div>

  <div v-if="fullscreenImage" class="fullscreen-overlay" @click="closeFullscreen">
    <img :src="fullscreenImage" class="fullscreen-image" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { ecwidApi } from '@/services/ecwidApi';
import { useCartStore } from '@/stores/cart';
import { BaseButton, BaseSpinner } from '@/components';

import type { EcwidProduct } from '@/types/ecwid';

const props = defineProps<{
  id: string;
}>();

const cartStore = useCartStore();

const isLoading = ref(true);
const showLeftContent = ref(false);
const showRightContent = ref(false);
const product = ref<EcwidProduct | null>(null);
const currentImageIndex = ref(0);
const fullscreenImage = ref<string | null>(null);

const productImages = computed(() => {
  if (!product.value) return [];

  const images: string[] = [];
  
  if (product.value.imageUrl) {
    images.push(product.value.imageUrl);
  }
  
  if (product.value.galleryImages?.length) {
    product.value.galleryImages.forEach((img) => {
      if (img.url && !images.includes(img.url)) {
        images.push(img.url);
      }
    });
  }
  
  return images;
});

const currentImage = computed(() => {
  return productImages.value[currentImageIndex.value] || '';
});

const hasMultipleImages = computed(() => {
  return productImages.value.length > 1;
});

const hasComparePrice = computed(() => {
  return product.value?.compareToPrice && product.value.compareToPrice > product.value.price;
});

const loadProduct = async (productId: number) => {
  try {
    isLoading.value = true;
    showLeftContent.value = false;
    showRightContent.value = false;
    
    product.value = await ecwidApi.getProduct(productId);
    currentImageIndex.value = 0;
    
    startContentAnimation();
  } catch (error) {
    console.error('Failed to load product:', error);
    isLoading.value = false;
  }
};

const startContentAnimation = () => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
  
  setTimeout(() => {
    showLeftContent.value = true;
  }, 1100);
  
  setTimeout(() => {
    showRightContent.value = true;
  }, 1400);
};

const previousImage = () => {
  if (!hasMultipleImages.value) return;
  
  currentImageIndex.value = currentImageIndex.value === 0 ? productImages.value.length - 1 : currentImageIndex.value - 1;
};

const nextImage = () => {
  if (!hasMultipleImages.value) return;
  
  currentImageIndex.value = currentImageIndex.value === productImages.value.length - 1 ? 0 : currentImageIndex.value + 1;
};

const setCurrentImage = (index: number) => {
  currentImageIndex.value = index;
};

const openFullscreen = () => {
  fullscreenImage.value = currentImage.value;
};

const closeFullscreen = () => {
  fullscreenImage.value = null;
};

const addToCart = () => {
  if (!product.value) return;
  
  cartStore.addToCart(product.value);
};

watch(() => props.id, (newId) => {
  if (newId) {
    loadProduct(parseInt(newId));
  }
}, { immediate: true });

onMounted(() => {
  if (props.id) {
    loadProduct(parseInt(props.id));
  }
});
</script>

<style scoped>
.product-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% + 3rem));
  min-height: 400px;
  max-height: 68%;
  width: 88%;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  z-index: 100;
}

.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.image-section {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.image-carousel {
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  height: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 12px;
  cursor: zoom-in;
  transition: opacity 0.3s ease;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.nav-button:hover {
  opacity: 1;
}

.nav-button-left {
  left: 10px;
}

.nav-button-right {
  right: 10px;
}

.image-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s ease;
}

.indicator.active {
  background: var(--color-accent);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

.product-details {
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.product-container::-webkit-scrollbar {
  display: none;
}

.product-name {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-default);
  margin: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-accent);
}

.old-price {
  font-size: 1.2rem;
  color: var(--color-secondary);
  text-decoration: line-through;
}

.product-description {
  flex-grow: 1;
  color: var(--color-secondary);
}

.product-description h3 {
  margin: 0 0 1rem 0;
  color: var(--color-default);
  font-size: 1.3rem;
  font-weight: 600;
}

.product-description :deep(p) {
  margin-bottom: 0.2rem;
  color: var(--color-secondary);
  line-height: 1.6;
}

.buy-button-container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 1rem;
}

.buy-button {
  align-self: flex-end;
  min-width: 200px;
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 10, 12, 0.95);
  z-index: 9999;
  cursor: zoom-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image {
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
  animation: zoomIn 0.3s ease-out;
  cursor: zoom-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
    max-height: 80%;
    padding: 1rem;
  }

  .image-section {
    flex: none;
    min-height: 250px;
  }

  .product-details {
    flex: none;
    padding: 0;
    align-items: center;
    text-align: center;
  }

  .product-name {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.4rem;
  }

  .buy-button {
    align-self: stretch;
  }

  .nav-button-left {
    left: 5px;
  }

  .nav-button-right {
    right: 5px;
  }
}
</style>
