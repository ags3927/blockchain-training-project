import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";


// Route Imports
import {routes} from "./routes/routes.js";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x:0, y:0 }
  }
});

// Vuex
import {store} from './store/store'

// Bootstrap-vue
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap-vue/dist/bootstrap-vue.css'


new Vue({
  el: '#app',
	store,
	router,
  render: h => h(App)
})
