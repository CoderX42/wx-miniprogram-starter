// utils/api.js — API 端点定义
import http from './http';

const API = {
  user: {
    info: () => http.getInstance().get('/user/info'),
    update: (data) => http.getInstance().post('/user/update', data),
  },
};

export default API;
