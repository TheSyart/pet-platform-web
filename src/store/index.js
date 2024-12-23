import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    globalVar: '这是一个全局变量'
  },
  mutations: {
    setGlobalVar(state, value) {
      state.globalVar = value;
    }
  },
  actions: {
    updateGlobalVar({ commit }, value) {
      commit('setGlobalVar', value);
    }
  },
  getters: {
    getGlobalVar: state => state.globalVar
  }
});