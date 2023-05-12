<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <header class="sticky top-0" style="z-index: 50;">
    <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
      <div class="flex align-items-start justify-content-between flex-row">
        <div>
          <div class="font-medium text-3xl text-900">QM Test System</div>
        </div>
        <div class="mt-3 lg:mt-0" id="toolbar">
        </div>
      </div>
    </div>
  </header>
  <RouterView class="px-2 py-5 md:px-6 lg:px-8" />
  <footer class="sticky bottom-0" style="z-index: 50;">
    <div id="footer"></div>
  </footer>
</template>

<style scoped></style>
