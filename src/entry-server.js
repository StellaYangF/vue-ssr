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
      resolve(app);
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
