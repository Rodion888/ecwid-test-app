<script setup lang="ts">
import { RouterView } from 'vue-router';
import { AppHeader } from '@/components';
</script>

<template>
  <AppHeader />
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style>
.main-content {
  margin-top: 70px;
  height: calc(100vh - 70px);
  padding: 0;
  overflow: hidden;
}
</style>
