// store/user.js — 用户状态示例
import { defineStore } from 'pinia';
import { createStorage } from '@wx-starter/core';

const storage = createStorage('user');

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    token: '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    displayName: (state) => state.profile?.name || '游客',
  },
  actions: {
    restore() {
      this.token = storage.get('token') || '';
      this.profile = storage.getJSON('profile');
    },
    setUser(token, profile) {
      this.token = token;
      this.profile = profile;
      storage.set('token', token);
      storage.setJSON('profile', profile);
    },
    clear() {
      this.token = '';
      this.profile = null;
      storage.remove('token');
      storage.remove('profile');
    },
  },
});
