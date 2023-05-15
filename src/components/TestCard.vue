<template>
    <Card>
        <template #title> {{ props.question.id }}. {{ props.question.question }} </template>
        <template #content>
            <div v-for="(answer, index) in options" :key="answer" class="flex flex-row align-items-center pointer"  @click="answerReceived ? {} : selectedAnswer = answer">
                <RadioButton :disabled="answerReceived" v-model="selectedAnswer" :inputId="answer + index" :name="props.question.question" :value="answer" />
                <label :for="answer" class="ml-2 align-middle my-1 exact-render">{{ answer.trim() }}</label>
            </div>
        </template>
        <template #footer v-if="answerReceived">
            <p :class="{'text-success': correctAnswered, 'text-danger': correctAnswered === false}">
                {{ 
                    correctAnswered === false ? 
                        `Incorrect answer. Correct one is ${question.correctAnswer}` :    
                        'Correct!'
                }}
            </p>
        </template>
    </Card>
</template>
<script lang="ts">
export interface TestCardProps {
    question: Question
    checkState?: 'pending' | 'completed' | 'realTime'
}
export type TestCardEvents = {
    (e: 'testStateChange', state: boolean | null, answer: string | null): void
}
</script>
<script setup lang="ts">
import type Question from '@/models/question';
import { $shuffle } from '@/utils';
import Card from 'primevue/card';
import RadioButton from 'primevue/radiobutton';
import { watch } from 'vue';
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<TestCardProps>(), {
    checkState: 'realTime'
})

const emit = defineEmits<TestCardEvents>();

const options = computed(() => $shuffle(props.question.allAnswers));

const selectedAnswer = ref<string | null>(null);

const correctAnswered = computed(() => selectedAnswer.value?.includes(props.question.correctAnswer.trim()) ?? null);

watch(correctAnswered, (newState) => emit('testStateChange', newState, selectedAnswer.value));

const answerReceived = computed(() => props.checkState !== 'pending' && selectedAnswer.value !== null)
</script>
<style scoped>
.exact-render {
    white-space: pre-wrap;
}
</style>