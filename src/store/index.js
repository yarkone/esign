/*
 * @Author: yarkone 
 * @Date: 2018-11-01 16:00:27 
 * @Last Modified by: yarkone
 * @Last Modified time: 2019-01-04 19:35:56
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLoading: false,
  direction: 'forward'
}
export default new Vuex.Store({
  state,
  mutations: {
    UPDATE_LOADING (state, status) {
      state.isLoading = status
    },
    UPDATE_DIRECTION (state, direction) {
      state.direction = direction
    }
  }
})