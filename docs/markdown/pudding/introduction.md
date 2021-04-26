---
order: 0
title: 介绍
---

## <img class="pudding-logo" src="/pudding.png" width="40"> PUDDING

`Pudding` 一套基于 React + Electron 搭建的客户端开发框架。

它是诞生于金融小组内部，是金融小组对于 Electron 开发经验的沉淀，也是我们理想的 Electron 项目前端工程解决方案。

<div class="pic-plus">
  <img width="125" src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"/>
  <span>+</span>
  <img width="125" src="../../public/electron.png"/>
</div>
<style>
  .pudding-logo{
    vertical-align: bottom;
  }
  .pic-plus > * {
    display: inline-block !important;
    vertical-align: middle;
  }
  .pic-plus span {
    margin: 0 20px;
    color: #aaa;
    font-size: 30px;
  }
</style>

## 特性

- ⚡️ 高效的开发方式
- 🛡 TypeScript 开发环境
- 🛠 完备的开发调试工具集成
- 📚 项目资产可视化文档集成
- 📦 开箱即用的工程化构建配置

## 基本信息

关键 npm 包版本

- [React 全家桶](https://react.docschina.org/) v17.0.1
- [Electron](https://www.electronjs.org/) v10.1.5
- [Webpack](https://www.webpackjs.com/) v4.44.2
- [Ant Design](https://www.webpackjs.com/) v4.10.1

Electron 内代码运行环境

| <img src="../../public/chromium.png" alt="chromium" width="24px" height="24px" /> Chromium | <img src="../../public/node.png" alt="nodejs" width="24px" height="24px" /> Node |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| v85.0.4183.121                                                                             | v12.16.3                                                                         |

## 快速上手

### 环境准备

`PUDDING`的运行和启动依赖 Node 运行环境，需要提前安装 [node](https://nodejs.org/en/) 并确保 node 版本是 12.16.3 或以上。

### 初始化项目

#### 1. 脚手架初始化（计划中）

为了方便使用，pudding 提供了用于快速初始化的脚手架工具 `pudding-cli`

pudding-cli 未来发布到公司内部 cnpm 源，提供以下使用方式:

```shell
pudding create project-name
```

#### 2. 克隆仓库

```git
git clone 仓库地址 project-name
```

### 开始开发

```shell
# cd 到项目跟目录下
yarn start
```

### 源码打包

```shell
# 打包产物会输出到 app/dist 目录
yarn build
```

### 客户端发布

```shell
# 客户端安装包会输出到 release/installer 目录
# 热更新资源包位于 release/update 目录
yarn release
```
