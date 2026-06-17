// config/dev.js — 开发环境
module.exports = {
  env: 'dev',
  apiBase: 'http://localhost:3000',
  cdnBase: 'http://localhost:8080',
  debug: true,
  // 模拟登录用户（仅开发环境）
  mockUser: {
    openId: 'mock-open-id',
    unionId: 'mock-union-id',
  },
};
