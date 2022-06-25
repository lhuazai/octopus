import Vue from 'vue';
import Vuex from 'vuex';
import storeComm from '@/store';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userInfo: storeComm.userInfo
  },
  plugins: [storeComm.persistedStateUser]
});
