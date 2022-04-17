import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.prototype.$shuffle = function (a) {
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


new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')
