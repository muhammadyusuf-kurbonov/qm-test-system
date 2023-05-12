<script setup lang="ts">
import TestCard from '@/components/TestCard.vue';
import { useTestsStore } from '@/stores/testsStore';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const testsStore = useTestsStore();

const startNewDialog = ref(!!useRoute().query.fileID);
const fileName = ref(useRoute().query.fileID as string ?? '');

function startTest() {
  testsStore.loadFile(fileName.value, false)
  startNewDialog.value = false;
}
</script>

<template>
  <Teleport to="#toolbar">
    <Button label="Start new" icon="pi pi-play" @click="startNewDialog = true">
    </Button>
  </Teleport>

  <Dialog modal v-model:visible="testsStore.state.loading" header="Loading tests ..."
    :style="{ width: '30vw', textAlign: 'center' }" :closable="false">
    <ProgressSpinner strokeWidth="8"></ProgressSpinner>
  </Dialog>

  <Dialog modal v-model:visible="startNewDialog" header="Start new test"
    :style="{ width: '30vw', textAlign: 'center' }" :closable="true">
    <InputText type="text" v-model="fileName" class="w-full" placeholder="File ID"></InputText>
    <template #footer>
        <Button label="Cancel" @click="startNewDialog = false" text />
        <Button label="Start" @click="startTest()" autofocus />
    </template>
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
