---
layout: page
sidebar: false
aside: false
outline: false
title: 首页
---

<!-- ============================================================
     HERO
     ============================================================ -->
<section class="home-hero" aria-labelledby="hero-name">

  <svg class="home-hero__logo" viewBox="0 0 48 48" fill="none" aria-hidden="true" role="img">
    <rect x="6" y="6" width="36" height="36" rx="10" stroke="currentColor" stroke-width="2.5" />
    <path d="M14 19h20M14 25h14M14 31h20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
  </svg>

  <h1 id="hero-name" class="home-hero__name">
    wx-miniprogram<span class="accent">.</span>
  </h1>
  <p class="home-hero__text">通用微信小程序项目骨架</p>
  <p class="home-hero__tagline">
    跨技术栈 core + 原生 / uni-app 双模板 — 让新项目从「搭建脚手架」变成「替换业务」。
  </p>

  <div class="home-hero__actions">
    <a class="home-hero__action home-hero__action--primary" href="/guide/getting-started">
      快速开始
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 5l7 7-7 7"/>
      </svg>
    </a>
    <a class="home-hero__action home-hero__action--secondary" href="https://github.com/CoderX42/wx-miniprogram-starter" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.41-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/>
      </svg>
      GitHub
    </a>
  </div>
</section>

<!-- ============================================================
     FEATURES
     ============================================================ -->
<section class="home-section home-features" aria-labelledby="features-title">
  <header class="home-section__head">
    <span class="home-section__eyebrow">FEATURES</span>
    <h2 id="features-title" class="home-section__title">为什么选这个 starter</h2>
    <p class="home-section__subtitle">6 个核心特性,每个都为「团队复用」和「项目可维护性」而设计。</p>
  </header>

  <div class="home-features__grid">

    <article class="feature-card">
      <svg class="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><path d="M12 22.08V12"/>
      </svg>
      <h3 class="feature-card__title">跨技术栈 core 库</h3>
      <p class="feature-card__desc">emitter / http / storage / auth / formatter 在原生小程序和 uni-app 中共享同一份 ESM 输出,直接 import。</p>
    </article>

    <article class="feature-card">
      <svg class="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
      </svg>
      <h3 class="feature-card__title">原生 + uni-app 双模板</h3>
      <p class="feature-card__desc">templates/mp-native(WXML/JS + Vant Weapp)和 templates/mp-uniapp(Vue 3 + wot-design-uni + Pinia),开箱即用。</p>
    </article>

    <article class="feature-card">
      <svg class="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19.439 7.85c-.049.322.118.646.406.847L23 10.75l-3.155 2.05a.85.85 0 0 0-.406.85v.5c0 4.16-2.84 7.85-7 7.85s-7-3.69-7-7.85V13.65a.85.85 0 0 0-.406-.85L1 10.75l3.155-2.05a.85.85 0 0 0 .406-.85V7.5"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      <h3 class="feature-card__title">6 个核心组件</h3>
      <p class="feature-card__desc">page-title、safe-area、empty、loading、error-block、popup — 业务无关,跨模板统一实现。</p>
    </article>

    <article class="feature-card">
      <svg class="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>
      </svg>
      <h3 class="feature-card__title">完整工程化</h3>
      <p class="feature-card__desc">多环境配置、CDN 多倍图、iconfont 同步、部署脚本、页面/组件脚手架生成器 — 工具链就位。</p>
    </article>

    <article class="feature-card">
      <svg class="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1h-3"/><path d="M2 18h18"/><path d="M21 22H3a1 1 0 0 1-1-1v-3"/>
      </svg>
      <h3 class="feature-card__title">VitePress 文档</h3>
      <p class="feature-card__desc">架构说明、API 文档、最佳实践 — 文档与代码同步维护,本站在你浏览的当前页面。</p>
    </article>

    <article class="feature-card">
      <svg class="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
      <h3 class="feature-card__title">业务无关</h3>
      <p class="feature-card__desc">不耦合任何业务、不耦合任何 UI 库内部,从零架构、零历史包袱 — 拿来即用,改得动。</p>
    </article>

  </div>
</section>

<!-- ============================================================
     TEMPLATES SHOWCASE
     ============================================================ -->
<section class="home-templates" aria-labelledby="templates-title">
  <header class="home-section__head">
    <span class="home-section__eyebrow">TEMPLATES</span>
    <h2 id="templates-title" class="home-section__title">两条技术路线,同一套核心</h2>
    <p class="home-section__subtitle">根据团队技术栈偏好选择 — 两个模板共享 core 库,业务代码风格保持一致。</p>
  </header>

  <div class="home-templates__grid">

    <article class="template-card">
      <span class="template-card__badge">NATIVE</span>
      <h3 class="template-card__name">mp-native</h3>
      <p class="template-card__desc">原生小程序模板。WXML + WXSS + JS,搭配 Vant Weapp UI 库,适合追求包体积最小和最贴近微信生态的团队。</p>
      <div class="template-card__stack" aria-label="技术栈">
        <span class="template-card__tag">WXML</span>
        <span class="template-card__tag">WXSS</span>
        <span class="template-card__tag">Vant Weapp</span>
        <span class="template-card__tag">Behaviors</span>
      </div>
      <a class="template-card__cta" href="/native/overview">
        查看模板文档
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </a>
    </article>

    <article class="template-card">
      <span class="template-card__badge">UNI-APP</span>
      <h3 class="template-card__name">mp-uniapp</h3>
      <p class="template-card__desc">uni-app + Vue 3 模板。Composition API、Pinia 状态管理、wot-design-uni 组件库,适合熟悉 Vue 生态和多端复用的团队。</p>
      <div class="template-card__stack" aria-label="技术栈">
        <span class="template-card__tag">Vue 3</span>
        <span class="template-card__tag">TypeScript</span>
        <span class="template-card__tag">Pinia</span>
        <span class="template-card__tag">wot-design-uni</span>
        <span class="template-card__tag">Mixins</span>
      </div>
      <a class="template-card__cta" href="/uniapp/overview">
        查看模板文档
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </a>
    </article>

  </div>
</section>

<!-- ============================================================
     QUICK START
     ============================================================ -->
<section class="home-quickstart" aria-labelledby="quickstart-title">
  <header class="home-section__head">
    <span class="home-section__eyebrow">QUICK START</span>
    <h2 id="quickstart-title" class="home-section__title">3 分钟跑起来</h2>
    <p class="home-section__subtitle">克隆、安装、选择模板 — 然后替换业务代码即可。</p>
  </header>

  <pre class="home-quickstart__code"><code><span class="home-quickstart__code-prompt">$ </span><span class="home-quickstart__code-cmd">git clone</span> https://github.com/CoderX42/wx-miniprogram-starter.git
<span class="home-quickstart__code-prompt">$ </span><span class="home-quickstart__code-cmd">cd</span> wx-miniprogram-starter
<span class="home-quickstart__code-prompt">$ </span><span class="home-quickstart__code-cmd">npm install</span>
<span class="home-quickstart__code-prompt">$ </span><span class="home-quickstart__code-cmd">npm run</span> dev <span class="home-quickstart__code-comment"># 在 WeChat DevTools 中导入 templates/mp-native 或 templates/mp-uniapp</span></code></pre>

  <p class="home-quickstart__hint">需要 <code>Node.js &gt;= 18</code>。更多细节见 <a href="/guide/getting-started">快速开始</a>。</p>

  <div class="home-quickstart__actions">
    <a class="home-hero__action home-hero__action--primary" href="/guide/getting-started">
      完整指引
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 5l7 7-7 7"/>
      </svg>
    </a>
    <a class="home-hero__action home-hero__action--secondary" href="/guide/architecture">
      架构总览
    </a>
  </div>
</section>
