import { createWebHashHistory, createRouter } from 'vue-router'

import Home from '../page/home/home.vue'
import LogicFlowContainer from '../page/simulator/LogicFlowContainer.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/simulator', component:LogicFlowContainer },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})