import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
// import getLyrics from 'genius-lyrics-api';

Vue.use(VueResource);
Vue.use(VueRouter);
// Vue.use(getLyrics);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')