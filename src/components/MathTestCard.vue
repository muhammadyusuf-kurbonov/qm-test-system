<template>
  <v-card class="ma-5 col-12 align-start text-start">
    <v-card-text>{{ id }}. <span v-html="question"></span>
    </v-card-text>
    <v-radio-group class="ma-5" :error="isCorrect===-1" :success="isCorrect===1"
                   :success-messages="isCorrect === 1 ? 'Congratulations!' : null"
                   :error-messages="isCorrect === -1 ? `Wrong!` : null" v-model="selectedOption">
      <v-row v-for="variant in variants" :key="variants.indexOf(variant)">
        <v-radio :value="variant" :disabled="checkMode">
        </v-radio>
          <span v-html="variant"></span>
      </v-row>
    </v-radio-group>
    <v-row v-if="isCorrect === -1" class="error--text">
      Correct answer is
      <div v-html="correct">
      </div></v-row>
  </v-card>
</template>

<script>

export default {
  name: "MathTestCard",
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
    'check'
  ],
  computed: {
    variants: function () {
      let answers = [];
      answers.push(this.correct)
      answers.push(...this.incorrect_string)
      return this.$shuffle(answers)
    },
    isCorrect: function () {
      if (!this.checkMode) return 0
      return this.selectedOption === this.correct ? 1 : -1;
    }
  },
  methods: {
    changeSelectedOption: function (variant) {
      console.log(variant)
      this.selectedOption = variant
    }
  },
  watch: {
    check: function (newValue){
      if (newValue){
        this.checkMode = true
        let result = false;
        if (this.selectedOption === this.correct)
          result = true
        this.$emit("check_result", result)
      }else{
        this.checkMode = false
        this.selectedOption = undefined
      }
    }
  }
}
</script>

<style scoped>

</style>