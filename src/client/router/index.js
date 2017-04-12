import Vue from 'vue'
import Router from 'vue-router'
import Allpeople from '@/components/All_people'
import login from '@/components/logIn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/people',
      name: 'All_people',
      component: Allpeople
    }
  ]
})
