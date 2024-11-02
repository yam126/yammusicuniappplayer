import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//全局变量定义
const store = new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    login(state, user) {
      console.log('state.user', user)
      state.user = user
    },
    updateUserFace(state, userFaceUrl) {
      if (state.user != null) {
        state.user.userFace = userFaceUrl
      }
    },
    logout(state) {
      state.user = null
    },
  },
})

export default store
