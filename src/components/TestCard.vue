<template>
  <v-card class="ma-5 col-12 align-start text-start">
    <v-card-text>{{ id }}. {{ question }}
    </v-card-text>
    <v-radio-group class="ma-5" :error="isCorrect===-1" :success="isCorrect===1"
                   :success-messages="isCorrect === 1 ? 'Congratulations!' : null"
                   :error-messages="isCorrect === -1 ? 'Wrong!' : null">
      <v-radio v-for="variant in variants" :disabled="checkMode" :key="variant" :label="variant"
               v-on:change="changeSelectedOption(variant)">
      </v-radio>
    </v-radio-group>
  </v-card>
</template>

<script>

function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export default {
  name: "TestCard",
  data() {
    return {
      selectedOption: undefined,
      checkMode: false
    }
  },
  props: [
    'id',
    'question',
    'correct',
    'incorrect_string',
  ],
  computed: {
    variants: function () {
      let answers = [];
      let split = this.incorrect_string.split(';');
      answers.push(this.correct)
      answers = answers.concat(split)
      return shuffle(answers)
    },
    isCorrect: function () {
      if (!this.checkMode) return 0
      return this.selectedOption === this.correct ? 1 : -1;
    }
  },
  created() {
    const callback = () => {
      this.checkMode = true
      let result = false;
      if (this.selectedOption === this.correct)
        result = true
      this.$emit("check_result", result)
    }
    this.$root.$on("check", callback)
  },
  methods: {
    changeSelectedOption: function (variant) {
      console.log(variant)
      this.selectedOption = variant
    }
  }
}
</script>

<style scoped>

</style>