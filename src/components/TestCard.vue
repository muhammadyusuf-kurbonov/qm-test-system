<template>
    <Card>
        <template #title> {{ props.question }} </template>
        <template #content>
            <div v-for="(answer, index) in options" :key="answer" class="flex flex-row align-items-center pointer"  @click="props.check ? {} : selectedAnswer = answer">
                <RadioButton :disabled="props.check" v-model="selectedAnswer" :inputId="answer + index" :name="props.question" :value="answer" />
                <label :for="answer" class="ml-2 align-middle my-1 exact-render">{{ answer.trim() }}</label>
            </div>
        </template>
        <template #footer v-if="props.check">
            <p :class="{'text-success': correctAnswered, 'text-danger': !correctAnswered}">
                {{ 
                    correctAnswered ? 
                        'Correct!' : 
                        `Incorrect answer. Correct one is ${correctAnswer}`
                }}
            </p>
        </template>
    </Card>
</template>
<script lang="ts">
export interface TestCardProps {
    question: string
    answers: string[]
    correctAnswer: string
    check?: boolean
}
export type TestCardEvents = {
    (e: 'testStateChange', state: boolean, answer: string | null): void
}
</script>
<script setup lang="ts">
import { $shuffle } from '@/utils';
import Card from 'primevue/card';
import RadioButton from 'primevue/radiobutton';
import { watch } from 'vue';
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<TestCardProps>(), {
    check: false
})

const emit = defineEmits<TestCardEvents>();

const options = computed(() => $shuffle(props.answers));

const selectedAnswer = ref<string | null>(null);

const correctAnswered = computed(() => selectedAnswer.value?.includes(props.correctAnswer.trim()) ?? false);

watch(correctAnswered, (newState) => emit('testStateChange', newState, selectedAnswer.value));
</script>
<style scoped>
.exact-render {
    white-space: pre-wrap;
}
</style>