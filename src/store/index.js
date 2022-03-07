import Vue from 'vue'
import Vuex from 'vuex'
import SidebarDrawerModule from './modules/SidebarDrawerModule'
import OverlayLoaderModule from './modules/OverlayLoaderModule'
import SelectedDrawModule from './modules/SelectedDrawModule'
import AuthModule from './modules/AuthModule'
import NotificationModule from './modules/NotificationModule'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    SidebarDrawerModule,
    OverlayLoaderModule,
    SelectedDrawModule,
    AuthModule,
    NotificationModule
  },
  plugins: [createPersistedState()]
})