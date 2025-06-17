<template>
  <header class="header">
    <div class="logo-container">
      <router-link to="/" class="logo-link">
        <AppLogo />
      </router-link>
    </div>

    <div class="cart-button-block">
      <router-link to="/cart" class="cart-button text-default">
        cart
        <div v-if="cartStore.itemsCount > 0" class="cart-items">
          {{ cartStore.itemsCount }}
        </div>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';

import AppLogo from './AppLogo.vue';

const cartStore = useCartStore();
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  z-index: 100;
}

.logo-container {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  margin-left: 6rem;
}

.logo-link {
  text-decoration: none;
  color: var(--color-default);
}

.cart-items {
  margin-left: 4px;
  margin-top: 1px;
  color: var(--color-accent);
  font-weight: 600;
}

.cart-button-block {
  margin-right: 2rem;
}

.cart-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 1.2rem;
  background-color: transparent;
  border: 1.4px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--color-secondary);
  font-weight: 600;
}

.cart-button:hover {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
