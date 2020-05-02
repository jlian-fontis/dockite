import Antd from 'ant-design-vue';
import { startCase, kebabCase, camelCase, snakeCase } from 'lodash';
import moment, { Moment } from 'moment';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import Fragment from 'vue-fragment';

import apolloProvider from './apollo';
import App from './App.vue';
import { bootstrap } from './dockite';
import router from './router';
import stateStore from './store';

window.Vue = Vue;

bootstrap();

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(PortalVue);
Vue.use(Fragment.Plugin);

Vue.filter('startCase', startCase);
Vue.filter('camelCase', camelCase);
Vue.filter('kebabCase', kebabCase);
Vue.filter('snakeCase', snakeCase);
Vue.filter('fromNow', (value: Date | Moment | string) => moment(value).fromNow());
Vue.filter('toLocaleDateTime', (value: Date | Moment | string) => moment(value).toLocaleString());

new Vue({
  router,
  store: stateStore,
  apolloProvider,
  render: h => h(App),
}).$mount('#app');
