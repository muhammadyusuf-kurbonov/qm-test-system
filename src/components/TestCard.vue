<template>
    <Card>
        <template #title> {{ props.question }} </template>
        <template #content>
            <div v-for="(answer, index) in options" :key="answer" class="flex flex-row align-items-center">
                <RadioButton :disabled="check" v-model="selectedAnswer" :inputId="answer + index" name="answer" :value="answer" />
                <label :for="answer" class="ml-2">{{ answer }}</label>
            </div>
        </template>
        <template #footer v-if="check">
            <p>
                {{ 
                    selectedAnswer == props.correctAnswer ? 
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
</script>
<script setup lang="ts">
import { $shuffle } from '@/utils';
import Card from 'primevue/card';
import RadioButton from 'primevue/radiobutton';
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<TestCardProps>(), {
    check: false
})

const options = computed(() => $shuffle(props.answers));

const selectedAnswer = ref(null);
</script>
