<template>
  <div class="logo">
    <span>ECWID</span>
    <span>ECWID</span>
  </div>
</template>

<style scoped>
.logo {
  position: relative;
}

.logo span {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 38px;
  font-weight: bold;
}

.logo span:nth-child(1) {
  color: transparent;
  -webkit-text-stroke: 0.8px var(--color-secondary);
}

.logo span:nth-child(2) {
  color: var(--color-secondary);
  -webkit-text-stroke: 1px var(--color-secondary);
  animation: uiverse 4s ease-in-out infinite;
}

@keyframes uiverse {
  0%,
  100% {
    clip-path: polygon(
      0% 45%,
      15% 44%,
      32% 50%,
      54% 60%,
      70% 61%,
      84% 59%,
      100% 52%,
      100% 100%,
      0% 100%
    );
  }

  50% {
    clip-path: polygon(
      0% 60%,
      16% 65%,
      34% 66%,
      51% 62%,
      67% 50%,
      84% 45%,
      100% 46%,
      100% 100%,
      0% 100%
    );
  }
}
</style>
