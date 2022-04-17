<template>
  <div>
    <v-container>
      <v-row class="col-12 ma-5">
        <v-text-field label="Введите имя файла" v-model="fileName" class="col-9"/>
        <v-btn v-on:click="getTests()" v-if="loadedFile !== fileName">GET</v-btn>
        <v-btn v-on:click="updateData()" v-if="loadedFile === fileName && checked">Restart</v-btn>
      </v-row>
      <v-row class="col-12 ma-5">

        <v-select label="Выберите количество" v-model="count" :items="items" item-text="label" item-value="value" class="col-7">
        </v-select>
        <div v-if="count !== -1" class="col-5">
          <v-btn @click="prevPage">&lang;</v-btn>
          {{ page }}
          <v-btn @click="nextPage">&rang;</v-btn>
        </div>
      </v-row>

      <v-row class="text-center col-12">

        <div v-if="questions.length === 0">
          <div class="col-12 text-center">No Tests loaded</div>
        </div>

        <div v-for="quest in questions" :key="quest['id']" class="col-12 ma-3">
          <MathTestCard :correct="quest['correct']"
                        :id="quest['id']"
                        :incorrect_string="quest['others']"
                        :question="quest['question']" class="col-12"
                        v-on:check_result="collectScore"
                        :check="checked"/>
        </div>
      </v-row>
      <v-row class="col-12" style="position: fixed; bottom: 0; right: 0">
        <v-btn v-if="!checked" @click="$root.$emit('check'); checked = true" class="col-12">Check</v-btn>
        <v-spacer></v-spacer>
        <span class="text-h3 ma-3 col-12 text-center darken-4" v-if="checked"> Ball: {{ score }}</span>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import axios from "axios";
import MathTestCard from "./MathTestCard";

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
  value: function(chunkSize) {
    let array = this;
    return [].concat.apply([],
        array.map(function(elem, i) {
          return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
    );
  }
});

export default {
  name: "QuizComponent",
  components: {MathTestCard},
  data: () => ({
    fileName: "",
    questions: [],
    allQuestions: [],
    score: 0,
    checked: false,
    count: -1,
    items: [
      {label: "25", value: 25},
      {label: "30", value: 30},
      {label: "50", value: 50},
      {label: "All", value: -1}
    ],
    page: 1,
    loadedFile: ""
  }),
  methods: {
    prevPage: function (){
      if (this.page > 1) {
        this.page--
        this.updateData()
      }
    },
    nextPage: function (){
      if ((this.page * this.count) < this.allQuestions.length) {
        this.page++
        this.updateData()
      }
    },
    updateData: function () {
      this.score = 0
      this.checked = false
      this.questions = []
      let thisPart
      if (this.count !== -1) {
        thisPart = this.allQuestions.chunk_inefficient(this.count)[this.page - 1]
      }else{
        thisPart = this.allQuestions
      }
      console.log("chunked ", thisPart)
      let shuffled = this.$shuffle(thisPart);
      for (let i = 0; i < shuffled.length; i++) {
        this.questions.push({... shuffled[i], id: i+1})
      }
    },
    collectScore: function (result) {
      if (result) this.score++
    },
    getTests: async function () {
      if ((this.fileName === this.loadedFile) && this.allQuestions.length)
        return
      let url = "/" + this.fileName + "/document.html";
      if (this.fileName.endsWith(".csv"))
        url = "/" + this.fileName
      let data = await axios.request({
        method: "GET",
        url: url,
        responseType: 'text',
        responseEncoding: '1251'
      })
      this.loadedFile = this.fileName
      console.log(data)
      if (!this.fileName.endsWith(".csv"))
        this.processData(data["data"])
      else
        this.processCSV(data["data"])
    },
    processData: function (allText) {
      let i=0;
      let result = [];
      let questions = [...allText.matchAll("<table>.*?<\\/table>")]
      for (let question of questions) {
        question = question[0].replace(/(\d+\.x-wmf\.png)/g, '/' + this.fileName + '/$&')
        let items = [...question.matchAll("(?=<td>).*?(?=<\\/td>)")].map((item) => item[0])
        result.push({
          id: ++i,
          question: items[0],
          correct: items[1],
          others: [
            items[2],
            items[3],
            items[4],
          ]
        })
      }
      this.allQuestions = result
    },
    processCSV: function (allText) {
      let i;
      const lines = allText.split("\n");

      let result = [];

      // NOTE: If your columns contain commas in their values, you'll need
      // to deal with those before doing the next step
      // (you might convert them to &&& or something, then covert them back later)
      // jsfiddle showing the issue https://jsfiddle.net/
      let headers = lines[0].split(";").filter(function (el) {
        return el !== ""
      });

      for(i = 1; i<lines.length; i++){

        let obj = {};
        let currentline = lines[i].split(";");

        for(let j=0; j<headers.length; j++){
          obj[headers[j]] = currentline[j];
        }

        result.push(obj);

      }
      let temp = []
      for (i=0; i< result.length; i++) {
        let csv_enter = result[i]

        let correct_code = "1"
        // eslint-disable-next-line no-prototype-builtins
        if (csv_enter.hasOwnProperty("Tj")) {
          correct_code = csv_enter["Tj"]
        }
        temp.push({
          id: i + 1,
          question: csv_enter["Savol"],
          correct: csv_enter["Javob" + correct_code],
          others: [
            csv_enter["Javob1"],
            csv_enter["Javob2"],
            csv_enter["Javob3"],
            csv_enter["Javob4"]
          ].filter(function (item) {
            return item !== csv_enter["Javob" + correct_code]
          })
        })
      }
      this.allQuestions = temp
    }
  },
  mounted() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    this.fileName = params['file']
    // eslint-disable-next-line no-debugger
    debugger;
  },
  watch: {
    allQuestions: function () {
      this.updateData()
    }
  }
}

</script>

<style scoped>

</style>