import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
import store from './store/index'
import './plugins/base'
import { API, API2 } from "../http-common";
import DatetimePicker from 'vuetify-datetime-picker'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import JsonCSV from 'vue-json-csv'

// import ECharts modules manually to reduce bundle size
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
]);

// register globally (or you can do it locally)
Vue.component('v-chart', ECharts)
// (Optional) import 'vuetify-datetime-picker/src/stylus/main.styl'

Vue.use(DatetimePicker)
Vue.component('downloadCsv', JsonCSV)







Vue.use({
  install(Vue) {
    Vue.prototype.$api = API
    Vue.prototype.$api2 = API2
  }
});
Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
