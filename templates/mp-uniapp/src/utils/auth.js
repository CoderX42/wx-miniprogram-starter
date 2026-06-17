// utils/auth.js — 登录态
import { Auth } from '@wx-starter/core';
import http from './http';

class AppAuth extends Auth {
  async doLogin() {
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({ success: resolve, fail: reject });
    });
    const res = await http.getInstance().post('/session/login', { code: loginRes.code });
    return { token: res.data?.token, userInfo: res.data?.userInfo };
  }
}

export const auth = new AppAuth({ namespace: 'auth' });
export default auth;
