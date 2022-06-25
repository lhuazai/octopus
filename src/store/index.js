import persistedState from 'vuex-persistedstate';
import userInfo from './modules/user';

const persistedStateUser = persistedState({
  storage: window.localStorage,
  key: 'active_userInfo',
  paths: ['userInfo']
});

export default {
  userInfo,
  persistedStateUser
};
