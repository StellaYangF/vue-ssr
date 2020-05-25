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
### 目录结构
```bash
├── config
│   ├── webpack.base.js
│   ├── webpack.client.js
│   └── webpack.server.js
├── dist
│   ├── client.bundle.js
│   ├── index.html
│   ├── index.ssr.html
│   ├── server.bundle.js
│   ├── vue-ssr-client-manifest.json
│   └── vue-ssr-server-bundle.json
├── package.json
├── public
│   ├── index.html
│   └── index.ssr.html
├── app.js
├── src
│   ├── App.vue
│   ├── components
│   │   ├── Bar.vue
│   │   └── Foo.vue
│   ├── entry-client.js
│   ├── entry-server.js
│   ├── main.js
│   ├── router.js
│   └── store.js
└── webpack.config.js
```

### 构建 Webpack 配置
通过 webpack 实现编译 Vue 项目

#### 安装插件
```shell
npm i webpack webpack-cli webpack-dev-server vue-loader vue-style-loader css-loader html-webpack-plugin @babel/core @babel/preset-env babel-loader vue-template-compiler webpack-merge -D
```

#### 编写配置
配置客户端、服务端打包

webpack.base.js
```js
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      { test: /\.js$/, 
        use: {
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] }
        }, 
        exclude: /node_modules/,
      }, 
      { test: /\.vue$/, use: 'vue-loader' }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

webpack.client.js
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base, {
  entry: {
    'client': path.resolve(__dirname, '../src//entry-client.js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html'
    })
  ]
})
```

webpack.server.js
```js
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base');

module.exports = merge(base, {
  target: 'node',
  entry: {
    'server': path.resolve(__dirname, '../src/entry-server.js')
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.ssr.html',
      excludeChunks: ['server']
    })
  ]
})
```


### src 
#### 集成路由
导出一个 createRouter 工厂函数，执行返回一个 VueRouter 实例
```js
import VueRouter from 'vue-router';
import Vue from 'vue';
import Foo from './components/Foo';
import Bar from './components/Bar';

Vue.use(VueRouter);

export default () => {
  let router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', component: Foo, },
      { path: '/bar', component: Bar, }
    ]
  });
  return router;
}
```

#### vuex 配置
导出一个 createStore 工厂函数，可执行返回一个 Store 实例
```js
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default () => {
  let store = new Vuex.Store({
    state: {
      name: "China"
    },
    mutations: {
      change_name(state) {
        state.name = "中国";
      }
    },
    actions: {
      change_name({ commit }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commit("change_name");
            resolve();
          }, 1000);
        });
      }
    }
  });

  if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
  }

  return store;
};

```

#### main.js 公共代码
构建一个 Vue 根实例，导出 createApp 工厂函数，执行返回这个根实例, router, store 实例
```js
import Vue from 'vue';
import App from './App.vue';
import createRouter from './router.js';
import createStore from './store.js' ;

export default () => {
  let router = createRouter();
  let store = createStore();
  let app = new Vue({
    router, 
    store,
    render: h => h(App),
  });
  return { app, router, store };
}
```

#### entry-client.js 客户端入口文件
客户端渲染，挂载
```js
import createApp from './main.js';

const { app } = createApp();
app.$mount('#app');
```

#### entry-server.js 服务端路由逻辑
```js
import createApp from "./main.js";

export default ctx => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp();

    router.push(ctx.url);

    router.onReady(() => {
      let matches = router.getMatchedComponents();
      if (matches.length == 0) {
        reject({ code: 404 });
      }
      // resolve(app);
      Promise.all(
       matches.map(component => {
          if (component.asyncData) {
            // asyncData只能在服务端调用
            return component.asyncData(store); // 返回的是一个Promise函数
          }
        })
      ).then(() => {
        ctx.state = store.state;
        resolve(app);
      });
    }, reject);
  });
};
```


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