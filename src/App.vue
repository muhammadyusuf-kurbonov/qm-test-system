<script setup lang="ts">
import Button from 'primevue/button'
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
      <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
        <div>
          <div class="font-medium text-3xl text-900">QM Test System</div>
        </div>
        <div class="mt-3 lg:mt-0">
          <Button label="Start new" icon="pi pi-play"></Button>
        </div>
      </div>
    </div>
  </header>
  <RouterView class="px-4 py-5 md:px-6 lg:px-8" />
</template>

<style scoped></style>
