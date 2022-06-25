import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../views/index';

Vue.use(VueRouter);

const routes = [
  /**
   * 路由会被识别为/:id/:index，
   * */
  {
    path: '/:id/:index',
    name: '练习',
    component: Index
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    document.title = to.name;
  }
  next();
});

export default router;
