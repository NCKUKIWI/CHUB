import Vue from 'vue'
import Router from 'vue-router'
import Allpeople from '@/components/All_people'
import Allactivity from '@/components/All_activity'
import Allproject from '@/components/All_project'
import Allgroup from '@/components/All_group'
import whatsOn from '@/components/what_on'
import space from '@/components/space'
import about from '@/components/about'
// import home from '@/components/home'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'what_on',
      component: whatsOn
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/people',
      name: 'All_people',
      component: Allpeople
    },
    {
      path: '/activity',
      name: 'All_activity',
      component: Allactivity
    },
    {
      path: '/project',
      name: 'All_project',
      component: Allproject
    },
    {
      path: '/group',
      name: 'All_group',
      component: Allgroup
    },
    {
      path: '/space',
      name: 'space',
      component: space
    }
  ]
})
