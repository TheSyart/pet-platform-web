import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    globalVar: {},
  },
  mutations: {
    setGlobalVar(state, value) {
      state.globalVar = value;
    },
  },
  actions: {
    updateGlobalVar({ commit }, value) {
      commit('setGlobalVar', value);
    },
  },
  getters: {
    getGlobalVar: (state) => state.globalVar,
  },
  plugins: [createPersistedState()], // 添加持久化插件
});
