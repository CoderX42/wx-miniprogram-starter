# 实现规划

本文档是项目实现规划的设计部分摘要。**完整版本（含详细步骤、文件清单、验证方案）请看仓库根目录的 [PLAN.md](https://github.com/your-org/wx-miniprogram-starter/blob/main/PLAN.md)**。

## Context

微信小程序项目在实际开发中普遍面临以下重复性工作：

- 每个新项目都要重写 HTTP 客户端、事件总线、登录态、页面基类
- 「通用代码」与「业务代码」混杂在同一个仓库里，迁移困难
- 跨技术栈（原生 vs uni-app）经验无法互用，团队每次切换栈都要重新熟悉

### 设计原则

- **不耦合任何业务** — 骨架不带任何业务词汇，从通用场景出发
- **不耦合任何 UI 库内部** — Vant/wot-design-uni 仅作为 peer 依赖
- **跨技术栈共用 core** — 同一份 emitter/http/storage 在两个模板下运行
- **约定优于配置** — 目录结构、文件命名、API 路径都遵循明确规则
- **零历史包袱** — 全部从零写，避免引入任何特定项目的设计包袱

## 关键设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 包管理 | npm workspaces | 简单、生态成熟、VitePress 支持 |
| 核心库打包 | 原始 ESM，不打包 | core 体积小、被小程序直接 import 无需打包 |
| 文档站 | VitePress | Vue 生态默认、Vite 启动快、Markdown 友好 |
| 路由 | 不提供 router，沿用原生 | 微信路由足够用；提供 helper 函数 |
| 状态管理 | core 不带，由模板自带（Pinia for uni-app） | 状态管理是模板职责 |
| 登录态 | core 提供 Auth 基类，模板配置 wx.login | 登录流程业务相关，基类只管 token 存储 |
| 测试 | Jest 单测 core，模板用微信开发者工具手测 | 小程序组件测试成本高 |
| CI | GitHub Actions：lint + test + docs build | 标准方案 |

## 实施步骤

| 步骤 | 内容 | 状态 |
|------|------|------|
| **Step 1** | 初始化仓库结构 | ✅ 完成 |
| **Step 2** | packages/core 库（11 模块 + 测试） | ✅ 完成 |
| **Step 3** | templates/mp-native 原生模板 | ✅ 完成 |
| **Step 4** | templates/mp-uniapp 模板 | ✅ 完成 |
| **Step 5** | docs 文档站（VitePress） | ✅ 完成 |
| **Step 6** | CI + 收尾 | ✅ 完成 |

## 交付总结

| 维度 | 数值 |
|------|------|
| 源代码文件 | 119 |
| 文档文件 | 30 |
| 核心库行数 | 1181 |
| 单元测试 | 45 / 45 通过 |
| 核心库模块数 | 11 |
| 核心组件 | 6 × 2 模板 = 12 实现 |
| 业务示例页面 | 4 × 2 模板 = 8 个 |
| 构建脚本 | 5（native）+ 2（uni-app） |
| GitHub Actions | 2（ci + docs） |
| 总步骤完成度 | 6 / 6（100%） |

## 详细规划

完整的目录结构、文件清单、验证方案、实施约束请查看 [PLAN.md](https://github.com/your-org/wx-miniprogram-starter/blob/main/PLAN.md)（项目根目录）。
