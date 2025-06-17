<template>
  <button class="glow-button" :class="[type, { disabled }]" :disabled="disabled" @click="handleClick"
    @mousemove="handleMouseMove">
    <span class="glow"></span>

    <template v-if="type === 'btn'">
      <span class="button-text">{{ text }}</span>
    </template>

    <template v-else>
      <span v-if="type === 'cross'" class="icon">✕</span>
      <span v-if="type === 'arrow-left'" class="icon">&#10094;</span>
      <span v-if="type === 'arrow-right'" class="icon">&#10095;</span>
    </template>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'btn' | 'cross' | 'arrow-left' | 'arrow-right';
  text?: string;
  disabled?: boolean;
}

interface Emits {
  buttonClick: [];
}

withDefaults(defineProps<Props>(), {
  type: 'btn',
  text: '',
});

const emit = defineEmits<Emits>();

const handleClick = () => emit('buttonClick');

const handleMouseMove = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLButtonElement;
  const rect = button.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  button.style.setProperty('--x', `${x}%`);
  button.style.setProperty('--y', `${y}%`);
};
</script>

<style scoped>
.glow-button {
  --x: 90%;
  --y: 50%;
  padding: 0.4rem 1.2rem;
  width: 12rem;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgb(210, 202, 202);
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.button-text {
  position: relative;
  font-weight: bold;
  z-index: 2;
  pointer-events: none;
}

.glow {
  content: '';
  position: absolute;
  top: var(--y, 50%);
  left: var(--x, 90%);
  width: 180px;
  height: 160px;
  background: radial-gradient(43.3% 44.23% at 50% 49.51%,
      #f0f0e5 29%,
      #f4efc1 40%,
      #f3cfbb 50%,
      rgba(255, 170, 129, 0.3) 70%,
      rgba(214, 211, 210, 0) 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(5px);
  transition:
    opacity 0.3s ease-in-out,
    transform 0.1s ease-out;
  opacity: 1;
  z-index: 1;
  pointer-events: none;
}

.glow-button:hover .glow {
  opacity: 1;
}

.glow-button:active .glow {
  transform: translate(-50%, -50%) scale(0.9);
}

.glow-button.cross,
.glow-button.arrow-left,
.glow-button.arrow-right {
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 50%;
}

.glow-button.cross .icon,
.glow-button.arrow-left .icon,
.glow-button.arrow-right .icon {
  color: rgb(9, 10, 12);
  font-size: 1rem;
  z-index: 2;
  pointer-events: none;
}

.glow-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: rgb(9, 10, 12);
}

.glow-button.disabled .glow {
  opacity: 0;
}

.glow-button.disabled:hover .glow {
  opacity: 0;
}
</style>
