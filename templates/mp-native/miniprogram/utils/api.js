// utils/api.js — API 端点定义
// 在这里按业务模块组织接口。消费 http 客户端。

const http = require('./http');

const API = {
  user: {
    /** 获取用户信息 */
    info: () => http.getInstance().get('/user/info'),

    /** 更新用户信息 */
    update: (data) => http.getInstance().post('/user/update', data),
  },

  // 在此继续添加业务模块
  // order: { list: (params) => http.getInstance().get('/order/list', params) },
};

module.exports = API;
