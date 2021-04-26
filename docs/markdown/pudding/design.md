---
order: 1
title: 框架设计
---

# 框架设计

## 初衷

由于 Rhine2、Rainbow 等项目开发与协作过程中存在较多的痛点，开发体验差，基础设施版本老旧且改造成本高，优化难度大，组内成员诟病已久。考虑到未来应用中心仍会不断有 Electron 客户端类项目，未雨绸缪之下，组内讨论后决定重新搭建一套全新的客户端脚手架，把以往踩过的坑荡平的同时也能够为后续新项目的开发效率及体验带来质的提升。

所以，PUDDING 是金融小组对于 Electron 开发的经验沉淀和技术输出，也是我们理想的 Electron 项目前端工程解决方案。

## 技术选型

<table>
	<tr>
	    <th>跨平台桌面客户端框架</th>
	    <th>HTML+CSS+JS 开发</th>
	    <th>前端工程化</th>  
	</tr >
	<tr >
	    <td rowspan="4"><code>Electron</code></td>
	    <td>CSS-IN-JS 库：<code>Styled-Components</code></td>
	    <td>代码编译工具：<code>Babel</code></td>
	</tr>
	<tr>
	    <td>JS MV* 框架：<code>React</code></td>
	    <td>模块打包工具：<code>Webpack</code></td>
	</tr>
	<tr>
	    <td>页面 UI 组件库：<code>Ant Design</code></td>
	    <td>文档直出工具：<code>Dumi</code></td>
	</tr>
	<tr>
	    <td>JS 语言增强：<code>TypeScript</code></td>
	    <td>代码格式规范工具：<code>Prettier</code></td>
	</tr>
</table>

## 项目结构设计

针对老版本框架的目录结构混乱且项目组织方式过于冗余的问题，设计考量之初，就决定对项目的目录逻辑做大幅的简化，金融小组内部重新讨论并设计了这套且更贴合前端项目开发直觉的项目结构，保证目录名称语义化的同时使结构更加简单合理化。

项目结构主要分为 3 大块： `app` `build` `docs`

`app目录`即管理源代码及进行业务开发的目录

`build目录`管理了整个项目的 Webpack 构建相关文件 以及 启动开发服务、进行打包、执行发布的 npm scripts 脚本

`docs目录`负责管理项目文档的所有内容

`release目录`被`gitignore文件`标记, 不会被 git 进行监测，主要存放执行发布命令执行后输出的最终客户端产物

由于整个项目所有的 npm 依赖都通过根目录下的 package.json 进行管理，所以不需要再像老版框一样维护两套`package.json`及`node_modules目录`， 可以说是大大简化了项目管理成本

下列通过非标准的矩形树图的形式展示了整个项目结构的俯瞰图：

![目录结构设计图](/design.png)

## 构建链路

_开发阶段_

通过`yarn start` 命令启动开发服务，会执行路径为 `build/scripts/start.js` 的脚本，该脚本首先进行`main`及`renderer`代码的同步编译及打包，同时启动对`3000`端口的监听服务，当通过`webpack-dev-server`进行打包的`renderer`代码在`3000`端口就绪后，启动`Electron`进程加载`renderer`页面

通过`yarn doc` 命令启动文档开发服务，将通过 `build/scripts/doc.js` 脚本，开启 dumi 对`docs`内容进行编译打包，在`4000`端口就绪后，可通过浏览器货`Electron`启动新的渲染进程访问 [本地文档网站](http://localhost:4000)。

在开发服务启动完成后，时时监听`app/src`目录及`docs`目录下文件改动，通过增量构建方式对改动内容进行重写编译，`renderer`页面及文档网站将响应更新后内容

_构建阶段_

通过`yarn build` 命令启动对源代码的打包进程，会执行路径为 `build/scripts/build.js` 的脚本，该脚本会根据 webpack `production模式`配置完成`main`及`renderer`代码的同步编译及打包,在`app`目录下输出 `dist` 最终产物目录

_发布阶段_

通过`yarn release` 命令启动对源代码的打包进程，会首先进行一次`yarn build`构建，随后执行路径为 `build/scripts/release.js` 的脚本，该脚本首先将`windows平台exe外壳程序`解压到`release目录`后，将构建产物`dist`目录中所有内容拷贝至`release目录`下对应的客户端目录中,最后将 win32、win64 客户端目录进行 zip 压缩，完成发布流程

具体链路流程如下图：

![构建链路示意图](/build.png)

## 热更新流程

待完善
