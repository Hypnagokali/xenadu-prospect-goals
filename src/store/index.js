import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import goals from './goals';
import friends from './friends';
import users from './users';
import monitor from './monitor';
import states from './states';
import requestState from './request-state';
import socialMedia from './socialMedia';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
  },
  mutations: {
    TOGGLE_LOADING(state) {
      state.isLoading = !state.isLoading;
    },
  },
  actions: {
    //
  },
  modules: {
    requestState,
    auth,
    goals,
    friends,
    users,
    monitor,
    states,
    socialMedia,
  },
});
