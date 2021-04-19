import Vue from 'vue'
import App from './App.vue'
import eui from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Message } from 'element-ui';
import router from './router/index'


Vue.config.productionTip = false
Vue.prototype.$message=Message

Vue.use(eui)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
