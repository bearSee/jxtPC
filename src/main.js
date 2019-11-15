/* eslint-disable */
import Vue from 'vue';              // vue.js引入
import App from './App';            // 入口vue文件
import router from './router';      // 前端路由引入
import animate from 'animate.css';  //annimate.css引入


import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = `${window.location.protocol}//${window.location.host}/jixintong`;
// axios.defaults.baseURL = 'http://47.112.20.232:8080/';
axios.defaults.timeout = 30000;
axios.defaults.transformRequest = [data => qs.stringify(data)];

// 添加一个请求拦截器
axios.interceptors.request.use((config) => {
  if (window.localStorage.getItem('Authorization')) {
    config.headers.Authorization = window.localStorage.getItem('Authorization');
  }
  // get请求增加时间戳，避免服务器304
  if (config.method === 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params,
    };
  }
  return config;
}, (error) => {
  Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(
  (res) => {
    if (res.config.responseType === 'blob') {
      return Promise.resolve(res);
    }
    if (res.headers.authorization) {
      window.localStorage.setItem('Authorization', res.headers.authorization);
    }
    if (res.data.ok) {
      if ((res.status === 200 || res.status === '200') && res.data.message) {
        Vue.prototype.$message.success(res.data.message);
      }
      return res;
    }
    Vue.prototype.$message.error(res.data.message);
    if (res.data.code === '10000') {
      location.replace('/#/login');
    }
    return Promise.reject(res);
  },
  (res) => {
    if (res.response) {
      Vue.prototype.$message.error(res.response.data.message);
    }
    return Promise.reject(res.response);
  },
);

Vue.prototype.$http = axios;

import './element-variables.scss'   // 定制的主题色的样式以及element-UI样式
import ElementUI from 'element-ui';
Vue.use(ElementUI);

import zteUI from './components/modules';
Vue.use(zteUI);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
