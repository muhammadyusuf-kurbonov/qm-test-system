import Vue from 'vue'
import VueRouter from 'vue-router'
import MainTestComponent from "../components/MathTests";
import QuizComponent from "../components/QuizComponent";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Math',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: MainTestComponent
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: QuizComponent
  }
]

const router = new VueRouter({
  routes
})

export default router
