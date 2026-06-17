---
layout: home

hero:
  name: wx-miniprogram-starter
  text: 通用微信小程序项目骨架
  tagline: 跨技术栈 core + 原生 / uni-app 双模板 — 让新项目从「搭建脚手架」变成「替换业务」
  actions:
    - theme: brand
      text: 进入文档 →
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/

features:
  - title: 📦 跨技术栈 core 库
    details: 同一份 emitter / http / storage / auth / formatter 在原生小程序和 uni-app 中运行。原始 ESM 输出，小程序可直接 import。
  - title: 🎯 原生 + uni-app 双模板
    details: templates/mp-native（WXML/JS + Vant Weapp）和 templates/mp-uniapp（Vue 3 + wot-design-uni + Pinia），开箱即用。
  - title: 🧩 6 个核心组件
    details: page-title、safe-area、empty、loading、error-block、popup — 业务无关、最常被复用，跨模板统一实现。
  - title: 🛠️ 完整工程化
    details: 多环境配置、CDN 多倍图、iconfont 同步、部署脚本、页面/组件脚手架生成器。
  - title: 📚 VitePress 文档
    details: 架构说明、API 文档、最佳实践 — 文档与代码同步维护。
  - title: 🔌 业务无关
    details: 不耦合任何业务、不耦合任何 UI 库内部，从零架构、零历史包袱。
---

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Splash 页可选：自动滚动到顶部
  window.scrollTo(0, 0);
});
</script>
