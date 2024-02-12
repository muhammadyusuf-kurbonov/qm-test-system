import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
//core
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";

//icons
import "primeicons/primeicons.css";
import PrimeVue from 'primevue/config';


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    ripple: true
});

app.mount('#app')
