const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const { debug, info, error } = require('./utils/log4');
const koaJwt = require('koa-jwt');
const { secret } = require('./config');

const users = require('./routes/users');
const login = require('./routes/login');
const menus = require('./routes/menus');
const roles = require('./routes/roles');
const depts = require('./routes/depts');

// error handler
onerror(app);

// 导入数据库链接
require('./config/db');

// middlewares

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);
app.use(json());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
);
app.use(async (ctx, next) => {
  // info(`params: ${JSON.stringify(ctx.request.body || ctx.request.query)}`);
  await next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        message: 'Token 认证超时',
      };
    } else {
      throw err;
    }
  });
});

app.use(koaJwt({ secret }).unless({ path: [/^\/login/] }));

// routes
app.use(login.routes(), login.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(menus.routes(), menus.allowedMethods());
app.use(roles.routes(), roles.allowedMethods());
app.use(depts.routes(), depts.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
  error(err);
});

module.exports = app;
