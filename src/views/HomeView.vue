<script setup lang="ts">
import TestCard from '@/components/TestCard.vue';
import { useTestsStore } from '@/stores/testsStore';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const testsStore = useTestsStore();

const startNewDialog = ref(!!useRoute().query.fileID);
const newTestMode = ref<'exam' | 'train'>('train');
const testInProgress = ref(false);
const fileName = ref(useRoute().query.fileID as string ?? '');

const score = ref(0);

function startTest() {
  testsStore.loadFile(fileName.value, newTestMode.value === 'exam')
  startNewDialog.value = false;
  testInProgress.value = true;
  score.value = 0;
}

function completeTest() {
  testInProgress.value = false;
}
</script>

<template>
  <Teleport to="#toolbar" v-if="!testInProgress || newTestMode === 'train'">
    <Button label="Start new" icon="pi pi-play" @click="startNewDialog = true">
    </Button>
  </Teleport>
  <Teleport to="#toolbar" v-if="testInProgress && newTestMode === 'exam'">
    <Button label="Check and complete" icon="pi pi-check-square" @click="completeTest">
    </Button>
  </Teleport>
  <Teleport to="#footer" v-if="!testInProgress && !startNewDialog">
    <div class="w-full text-center py-4 bg-primary text-white">
      <h3>Total score: {{ score }} / {{ testsStore.state.questions.length }}</h3>
    </div>
  </Teleport>

  <Dialog modal v-model:visible="testsStore.state.loading" header="Loading tests ..."
    :style="{ width: '30vw', textAlign: 'center' }" :closable="false">
    <ProgressSpinner strokeWidth="8"></ProgressSpinner>
  </Dialog>

  <Dialog modal v-model:visible="startNewDialog" header="Start new test" :closable="true">
    <div class="w-full col-12 row">
      <InputText type="text" v-model="fileName" placeholder="File ID" class="w-full"></InputText>
    </div>
    <div class="w-full col-12 row">
      <Dropdown v-model="newTestMode" :options="[{ name: 'Exam', value: 'exam' }, { name: 'Learn', value: 'train' }]"
        placeholder="Mode"
        optionLabel="name"
        option-value="value"
        class="w-full">
      </Dropdown>
    </div>

    <template #footer>
      <Button label="Cancel" @click="startNewDialog = false" text />
      <Button label="Start" @click="startTest()" :disabled="!fileName || !newTestMode" autofocus />
    </template>
  </Dialog>

  <template v-for="question in testsStore.state.questions" :key="question.id">
    <TestCard
      class="mx-2 lg:mx-8 my-4"
      :question="question.question"
      :answers="question.allAnswers"
      :correctAnswer="question.correctAnswer"
      :check-state="newTestMode === 'train' ? 'realTime' : (testInProgress ? 'pending' : 'completed')"
      @test-state-change="(state) => state ? score++ : score--"></TestCard>
  </template>
</template>
