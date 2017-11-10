import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import Auth from '@/components/Auth'
import Game from '@/components/Game'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/Lobby',
      name: 'Lobby',
      component: MainPage
    },
    {
      path: '/auth/:modePage',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/Game/:nameGame',
      name: 'Game',
      component: Game
    },
    {
      path: '*',
      redirect: { name: 'Lobby'}
    },
    {
      path: '/',
      redirect: { name: 'Lobby'}
    }
  ]
})
