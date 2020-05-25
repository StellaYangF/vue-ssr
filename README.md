## 服务端渲染 ssr
全称 Server Side render
对比 浏览器渲染：
- 浏览器里进行渲染, 服务端渲染 在服务端将对应的数据请求完，在后端**拼装**好页面返回给前端 
- 客户端渲染不利于 **SEO** 优化,服务端渲染的结果可以被浏览器抓取到
- 客户端渲染可能会出现**白屏**，通过 ssr 可以减少白屏时间
- SSR 缺陷就是**占**用大量 **cpu** 和内存
- API 不能用 只支持 **beforeCreate**， **created**

## 安装依赖包
### 初始化
```shell
npm init -y
```
### 前端 Vue 相关
```shell
npm install vue vue-router vuex vue-server-renderer(vue 服务端渲染插件)
```

### 后端 Node 相关框架
```bash
npm install koa(node的框架) koa-router(后端路由) koa-static(后端返回的静态页面)
```

### 打包 Webpack 相关
**Webpack** 主要就是打包文件用的，这里为简单运用
模块规范也是 **node** 中的语法

- webpack(核心打包用) webpack-cli(解析命令行参数)
- webpack-dev-server (在开发环境下帮我们提供一个开发环境 支持更新)
- babel-loader (webpack和babel的一个桥梁) @babel/core(babel的核心模块) @babel/preset-env(可以把高级语法转换成es5语法)
- vue-style-loader(vue解析样式 插入到页面中) css-loader
- vue-loader vue-template-compiler
- html-webpack-plugin

- webpack-merge 合并webpack配置的

## 实践
### 构建 Web 服务
#### 引入依赖包
```js
const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const VueServerRender = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');
const router = new Router();
const app = new Koa();
const prot = 3000;
```

#### 引入 Webpack 处理后的逻辑代码，创建 **BundleRender** 实例，进一步在服务端处理好要渲染的页面
```js
const ServerBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const template = fs.readFile('./dist/index.ssr.html');
const render = VueServerRender.createBundleRenderer(ServerBundle, {
  template,
  clientManifest,
});
```

#### 创建路由接口 /
```js
router.get('/', async ctx => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString({ url: '/'}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
})
```

#### 注册 Koa 中间件
- 路由中间件
- 静态资源中间件
- Vue-router 匹配的路由系统，按当前访问路径渲染；找不到时，报 404
```js
app.use(router.routes());
app.use(static(path.join(__dirname, 'dist')));
app.use(async ctx => {
  try {
    ctx.body = await new Promise((resolve, reject) => {
      render.renderToString({url: ctx.url}, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  } catch (e) {
    if (error.code === 404) {
      ctx.body = '404';
    }
  }
});
```

#### 监听端口
```js
app.listen(port, () => console.log(`Server listening on http://localhost:${prot},  Ctl + C to stop.`));
```