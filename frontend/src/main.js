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

new Vue({
  el: '#app',
	store,
	router,
  render: h => h(App)
})
