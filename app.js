const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const { debug, info, error } = require('./utils/log4');

const users = require('./routes/users');

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
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
);

app.use(async (ctx, next) => {
  info(`params: ${JSON.stringify(ctx.request.body || ctx.request.query)}`);
  await next();
});
// routes
app.use(users.routes(), users.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
  error(err);
});

module.exports = app;
