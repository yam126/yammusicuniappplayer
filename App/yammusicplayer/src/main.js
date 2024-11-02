import Vue from 'vue'
import App from './App'
import store from './store'
import './uni.promisify.adaptor'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.prototype.$store = store


App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()
