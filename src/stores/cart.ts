import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { CartItem, EcwidProduct } from '@/types/ecwid';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const itemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  });

  const isEmpty = computed(() => items.value.length === 0);

  const addToCart = (product: EcwidProduct, quantity = 1) => {
    const existingItem = items.value.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        product,
        quantity,
      });
    }

    saveToLocalStorage();
  };

  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex(item => item.product.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
      saveToLocalStorage();
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
        saveToLocalStorage();
      }
    }
  };

  const decreaseQuantity = (productId: number) => {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      if (item.quantity <= 1) {
        removeFromCart(productId);
      } else {
        item.quantity -= 1;
        saveToLocalStorage();
      }
    }
  };

  const clearCart = () => {
    items.value = [];
    saveToLocalStorage();
  };

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('ecwid-cart', JSON.stringify(items.value));
    }
  };

  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('ecwid-cart');
      if (saved) {
        try {
          items.value = JSON.parse(saved);
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
          items.value = [];
        }
      }
    }
  };

  loadFromLocalStorage();

  return {
    items,
    itemsCount,
    totalPrice,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    decreaseQuantity,
    clearCart,
    loadFromLocalStorage,
  };
});
