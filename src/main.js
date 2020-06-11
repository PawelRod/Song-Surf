import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueYoutube from 'vue-youtube';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueYoutube);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')