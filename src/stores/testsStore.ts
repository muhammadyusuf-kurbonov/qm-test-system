import { reactive } from 'vue'
import { defineStore } from 'pinia'
import axios  from 'axios'
import type Question from '@/models/question'
import { $shuffle } from '@/utils'

export const useTestsStore = defineStore('tests', () => {
  const state: {loading: boolean, questions: Question[]} = reactive({
    loading: false,
    questions: []
  })

  function proccessTestFile(allText: string) {
    const questions = allText.split(new RegExp("\\+{2,} *\\n")).filter(part => part.trim().length > 0);
    const tests: Question[] = questions.map((questionAsText, index) => {
      const questionParts = questionAsText.split(new RegExp('={2,} *\\B')).filter(part => part.trim().length > 0);
      console.log(questionParts);
      const correctAnswer = questionParts.find((answer) => answer.trim().includes('#') || answer.trim().startsWith('#') || answer.trim().startsWith('*'))?.replace(new RegExp('[#\\*] *'), '') ?? questionParts[1]
      return {
        id: index,
        question: questionParts[0],
        correctAnswer: correctAnswer,
        allAnswers: questionParts.slice(1).map(answer => answer.trim().replace(new RegExp('[#\\*] *'), '')),
      }
    });

    return tests;
  }
  
  function processCSV(allText: string) {
    let rowIndex;
    const lines = allText.split("\n");

    const parsedLines: Record<string, string>[] = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    const headers = lines[0].split(";").filter(function (el) {
      return el !== ""
    });

    for(rowIndex = 1; rowIndex < lines.length; rowIndex++){
      const obj: Record<string, string> = {};
      const currentLineItems = lines[rowIndex].split(";");

      for(let columnIndex=0; columnIndex < headers.length; columnIndex++){
        obj[headers[columnIndex]] = currentLineItems[columnIndex];
      }

      parsedLines.push(obj);
    }

    return parsedLines.map((parsedLine, i) => {
      let correct_code = "1"

      if ("Tj" in parsedLine) {
        correct_code = parsedLine["Tj"]
      }
      return {
        id: i + 1,
        question: parsedLine["Savol"],
        correctAnswer: parsedLine["Javob" + correct_code],
        allAnswers: [
          parsedLine["Javob1"],
          parsedLine["Javob2"],
          parsedLine["Javob3"],
          parsedLine["Javob4"]
        ]
      };
    });
  }

  function loadFile(fileName: string, examMode: boolean = false) {
    state.loading = true;
    state.questions = [];

    let url = "/" + fileName + "/document.html";
    
    if (fileName.endsWith(".csv") || fileName.endsWith(".tests")) url = "/" + fileName;
    
    axios.request({
      method: "GET",
      url: url,
      responseType: 'text',
      responseEncoding: '1251'
    }).then(response => {
      let questions: Question[] = [];
      
      if (fileName.endsWith(".csv")) questions = processCSV(response.data);
      if (fileName.endsWith(".tests")) questions = proccessTestFile(response.data);

      return questions;
    }).then((questions) => {
      questions = examMode ? $shuffle(questions).slice(0, 25) : questions;

      state.questions = questions;
    }).catch(err => {
      console.error(err);
    }).finally(() => state.loading = false);
  }

  return { loadFile, state }
})
