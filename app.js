const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const VueServerRender = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');
const router = new Router();
const app = new Koa();
const port = 3000;

const ServerBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const template = fs.readFileSync('./dist/index.ssr.html', 'utf8');
const render = VueServerRender.createBundleRenderer(ServerBundle, {
  template,
  clientManifest,
});

router.get('/', async ctx => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString({ url: '/'}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
})

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

app.listen(port, () => console.log(`Server listening on http://localhost:${port} ,  Ctl + C to stop.`));