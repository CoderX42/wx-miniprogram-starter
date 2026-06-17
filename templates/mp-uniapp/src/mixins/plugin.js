// mixins/plugin.js — 全局混入
// 注入 $api / $emitter / $event + 通用方法
import { emitter, BusEvent } from '@wx-starter/core';
import api from '@/utils/api';

export default {
  data() {
    return {};
  },
  created() {
    this.$api = api;
    this.$emitter = emitter;
    this.$event = BusEvent;
  },
  methods: {
    /** 拨打电话 */
    $call(e) {
      const dataset = e?.currentTarget?.dataset || e?.target?.dataset || {};
      const phone = dataset.phone;
      if (phone) uni.makePhoneCall({ phoneNumber: phone });
    },
    /** 返回 */
    $back() {
      const pages = getCurrentPages();
      if (pages.length > 1) uni.navigateBack();
      else uni.reLaunch({ url: '/pages/index/index' });
    },
    /** 预览图片 */
    $preview(src) {
      if (src) uni.previewImage({ urls: [src] });
    },
    /** 复制 */
    $clipboard(text) {
      if (text) uni.setClipboardData({ data: text });
    },
    /** Toast */
    $toast(title, icon = 'none') {
      uni.showToast({ title, icon });
    },
  },
};
