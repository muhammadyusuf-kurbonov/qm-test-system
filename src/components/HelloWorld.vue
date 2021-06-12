<template>
  <v-container>
    <v-row class="col-12 ma-5">
      <v-text-field label="Введите имя файла" v-model="fileName" class="col-9"/>
      <v-btn v-on:click="getTests()">GET</v-btn>
    </v-row>

    <v-row class="text-center col-12">

      <div v-if="questions.length === 0">
        <div class="col-12 text-center">No Tests loaded</div>
      </div>

      <div v-for="quest in questions" :key="quest['id']" class="col-12 ma-3">
        <TestCard :correct="quest['correct']"
                  :id="quest['id']"
                  :incorrect_string="quest['others']"
                  :question="quest['question']" class="col-12"
                  v-on:check_result="collectScore"/>
      </div>
    </v-row>
    <v-row class="col-12" style="position: fixed; bottom: 0; right: 0">
      <v-btn v-if="!checked" @click="$root.$emit('check'); checked = true" class="col-12">Check</v-btn>
      <v-spacer></v-spacer>
      <span class="text-h3 ma-3 col-12 text-center darken-4" v-if="checked"> Ball: {{ score }}</span>
    </v-row>
  </v-container>
</template>

<script>
import TestCard from "@/components/TestCard";
import axios from "axios";

function shuffle(a) {
  console.log("shuffling ...")
  console.log(a)
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
  name: 'HelloWorld',
  components: {TestCard},
  data: () => ({
    fileName: "",
    questions: [],
    score: 0,
    checked: false
  }),
  methods: {
    collectScore: function (result) {
      if (result) this.score++
    },
    getTests: async function() {
      this.questions = []
      let data = await axios.request({
        method: "GET",
        url: "/"+ this.fileName +".csv",
        responseType: 'text',
        responseEncoding: '1251'
      })
      console.log(data)
      this.processData(data["data"])
    },
    processData: function (allText) {
      let i;
      var lines=allText.split("\n");

      var result = [];


      // NOTE: If your columns contain commas in their values, you'll need
      // to deal with those before doing the next step
      // (you might convert them to &&& or something, then covert them back later)
      // jsfiddle showing the issue https://jsfiddle.net/
      var headers=lines[0].split(";").filter(function (el){
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
      console.log(result)

      let newResult = shuffle(result)

      for (i=0; i< 30; i++) {
        let csv_enter = newResult[i]
        let correct_code = "1"
        // eslint-disable-next-line no-prototype-builtins
        if (csv_enter.hasOwnProperty("Tj")){
          correct_code = csv_enter["Tj"]
        }
        this.questions.push({
          id: i+1,
          question: csv_enter["Savol"],
          correct: csv_enter["Javob"+correct_code],
          others: [
            csv_enter["Javob1"],
            csv_enter["Javob2"],
            csv_enter["Javob3"],
            csv_enter["Javob4"]
          ].filter(function (item) {
            return item !== csv_enter["Javob"+correct_code]
          }).join(";")
        })
      }
    }
  }
}

</script>
