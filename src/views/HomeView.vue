<script setup lang="ts">
import { onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import TestCard from '@/components/TestCard.vue';
import { useTestsStore } from '@/stores/testsStore';

const testsStore = useTestsStore();

const loading = testsStore.state.loading;

onMounted(() => { testsStore.loadFile('FA-ru-2023.tests', false) })
</script>

<template>
  <Dialog modal v-model:visible="loading" class="p-4" header="Loading tests ..."
    :style="{ width: '30vw', textAlign: 'center' }" :closable="false">
    <ProgressSpinner strokeWidth="8"></ProgressSpinner>
  </Dialog>

  <template v-for="question in testsStore.state.questions" :key="question.id">
    <TestCard 
      class="mx-8 my-4" 
      :question="question.question"
      :answers="question.allAnswers"
      :correctAnswer="question.correctAnswer"  
    ></TestCard>
  </template>
</template>
