const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const static = require('koa-static');
const router = new Router();
const app = new Koa();
const PORT = 3000;
const VueServerRender = require('vue-server-renderer');
const fs = require('fs');

const template = fs.readFileSync('./dist/index.ssr.html', 'utf8');
const ServerBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const render = VueServerRender.createBundleRenderer(ServerBundle, {
  template,
  clientManifest,
})

router.get('/', async ctx => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString({ url: '/' }, (err, data) =>{
      if (err) reject(err)
      resolve(data);
    })
  })
})

app.use(router.routes());
app.use(static(path.resolve(__dirname, 'dist')));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT} , Ctl + C to stop.`));