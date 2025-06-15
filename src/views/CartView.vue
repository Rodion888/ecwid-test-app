<template>
  <div class="cart-page">
    <div class="cart-container">
      <div v-if="cartStore.items.length > 0" class="cart-items">
        <div 
          v-for="item in groupedCartItems" 
          :key="`${item.product.id}-${item.selectedOptions ? JSON.stringify(item.selectedOptions) : ''}`"
          class="cart-item"
        >
          <img 
            class="cart-image" 
            :src="item.product.imageUrl || item.product.galleryImages?.[0]?.url || '/placeholder.jpg'" 
            :alt="item.product.name"
          />
          
          <div class="cart-details">
            <span class="item-name text-bold text-default">
              {{ item.product.name }}
              <span v-if="item.selectedOptions" class="text-price">
                ({{ formatSelectedOptions(item.selectedOptions) }})
              </span>
            </span>
            <span class="item-quantity text-default">
              Quantity: <span class="item-size text-accent">{{ item.quantity }}</span>
            </span>
            <span class="item-price text-default">
              Price: <span class="item-size text-price">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </span>
          </div>
          
          <BaseButton 
            type="cross" 
            @buttonClick="removeFromCart(item)"
          />
        </div>
      </div>

      <div v-else class="empty-cart-message">
        <span class="text-default">Cart is empty</span>
      </div>
    </div>

    <div v-if="cartStore.items.length > 0" class="action-buttons">
      <BaseButton 
        type="btn" 
        text="Clear cart" 
        @buttonClick="clearCart"
      />
      <BaseButton 
        type="btn" 
        text="Place order" 
        @buttonClick="goToCheckout"
      />
    </div>

    <div v-if="showOrderModal" class="modal-overlay" @click="closeOrderModal">
      <div class="modal-content" @click.stop>
        <h2>Order placed!</h2>
        <p>Your order has been placed.</p>
        <p>Total: <strong>${{ cartStore.totalPrice.toFixed(2) }}</strong></p>
        <BaseButton 
          type="btn"
          text="Close"
          @buttonClick="closeOrderModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { BaseButton } from '@/components';

import type { CartItem } from '@/types/ecwid';

const router = useRouter();
const cartStore = useCartStore();

const showOrderModal = ref(false);

const groupedCartItems = computed(() => {
  const grouped: Record<string, CartItem> = {};
  
  cartStore.items.forEach(item => {
    const key = `${item.product.id}-${item.selectedOptions ? JSON.stringify(item.selectedOptions) : ''}`;

    if (grouped[key]) {
      grouped[key].quantity += item.quantity;
    } else {
      grouped[key] = { ...item };
    }
  });
  
  return Object.values(grouped);
});

const formatSelectedOptions = (options: Record<string, string> | undefined) => {
  if (!options) return '';
  return Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(', ');
};

const removeFromCart = (item: CartItem) => {
  cartStore.decreaseQuantity(item.product.id);
};

const clearCart = () => cartStore.clearCart();

const goToCheckout = () => {
  showOrderModal.value = true;
};

const closeOrderModal = () => {
  showOrderModal.value = false;
  cartStore.clearCart();
  router.push('/');
};
</script>

<style scoped>
.cart-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
}

.cart-container::-webkit-scrollbar {
  display: none;
}

.cart-container {
  width: 88%;
  height: 68%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 12px;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  color: var(--color-default);
  background-color: rgba(30, 30, 30, 0.4);
}

.cart-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-details {
  flex-grow: 1;
  margin-left: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  font-size: 0.9rem;
}

.item-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  flex: 1;
}

.item-quantity {
  margin-right: 20px;
  flex-shrink: 0;
}

.item-price {
  margin-right: 20px;
  flex-shrink: 0;
}

.text-bold {
  font-weight: 600;
}

.text-default {
  color: var(--color-default);
}

.text-accent {
  color: var(--color-accent);
}

.text-price {
  color: var(--color-accent);
}

.item-size {
  font-weight: 600;
}

.action-buttons {
  width: 88%;
  height: 0%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  gap: 1rem;
  z-index: 100;
}

.empty-cart-message {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: 1.2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 10, 12, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-content h2 {
  color: var(--color-accent);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal-content p {
  color: var(--color-default);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.modal-content strong {
  color: var(--color-accent);
}

@media (max-width: 548px) {
  .cart-container {
    width: 88%;
    padding: 0.6rem;
    bottom: 9.2rem;
  }

  .cart-item {
    flex-direction: row;
    align-items: flex-start;
    padding: 1rem;
    gap: 0.4rem;
  }

  .cart-image {
    width: 4rem;
    height: 5rem;
  }

  .cart-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 112px;
    margin-left: 0rem;
    gap: 0.5rem;
  }

  .item-name {
    max-width: 100%;
    font-size: 0.85rem;
  }

  .item-quantity, 
  .item-price {
    font-size: 0.8rem;
  }

  .action-buttons {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 88%;
    height: 6rem;
    padding: 0.6rem;
    gap: 0.6rem;
  }
}
</style>
