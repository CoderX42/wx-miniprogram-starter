import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'wx-miniprogram-starter',
  description: '通用微信小程序项目骨架 — 跨技术栈 core + 原生/uni-app 模板',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#ea4e82' }],
    ['meta', { property: 'og:title', content: 'wx-miniprogram-starter' }],
    ['meta', { property: 'og:description', content: '通用微信小程序项目骨架' }],
  ],
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'Core', link: '/core/overview' },
      { text: '原生模板', link: '/native/overview' },
      { text: 'uni-app 模板', link: '/uniapp/overview' },
      { text: '工具', link: '/tools/iconfont' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '架构总览', link: '/guide/architecture' },
            { text: '核心概念', link: '/guide/core-concepts' },
            { text: '开发约定', link: '/guide/conventions' },
          ],
        },
        {
          text: '项目元信息',
          items: [
            { text: '实现规划', link: '/guide/implementation-plan' },
          ],
        },
      ],
      '/core/': [
        {
          text: '核心库',
          items: [
            { text: '总览', link: '/core/overview' },
            { text: 'HTTP 客户端', link: '/core/http' },
            { text: 'Auth 鉴权', link: '/core/auth' },
            { text: 'Storage 存储', link: '/core/storage' },
            { text: 'Emitter 事件总线', link: '/core/emitter' },
            { text: 'Router 路由', link: '/core/router' },
            { text: 'Formatter 格式化', link: '/core/formatter' },
            { text: 'Validator 校验', link: '/core/validator' },
            { text: '事件常量', link: '/core/event-constants' },
          ],
        },
      ],
      '/native/': [
        {
          text: '原生模板',
          items: [
            { text: '总览', link: '/native/overview' },
            { text: 'Behaviors', link: '/native/behaviors' },
            { text: '核心组件', link: '/native/components' },
            { text: '环境配置', link: '/native/environment' },
            { text: '构建脚本', link: '/native/scripts' },
          ],
        },
      ],
      '/uniapp/': [
        {
          text: 'uni-app 模板',
          items: [
            { text: '总览', link: '/uniapp/overview' },
            { text: 'Mixins', link: '/uniapp/mixins' },
            { text: '核心组件', link: '/uniapp/components' },
            { text: '环境配置', link: '/uniapp/environment' },
            { text: '构建脚本', link: '/uniapp/scripts' },
          ],
        },
      ],
      '/tools/': [
        {
          text: '工具',
          items: [
            { text: 'iconfont 同步', link: '/tools/iconfont' },
            { text: 'CDN 多倍图', link: '/tools/cdn-image' },
            { text: '部署脚本', link: '/tools/deploy' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/CoderX42/wx-miniprogram-starter' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present',
    },
    search: {
      provider: 'local',
    },
  },
});
