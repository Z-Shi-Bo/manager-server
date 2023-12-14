/**
 * 用户管理模块
 */
const router = require('koa-router')();
// 导入数据库集合
const User = require('../models/userSchema');
const { success, fail } = require('../utils/useTool');
// 导入jwt库
const jwt = require('jsonwebtoken');
// 加密串
const secret = 'abcdefghijklmnopqrstuvwxyz1234567890';

router.prefix('/users');

router.post('/login', async (ctx) => {
  try {
    const { username, password } = ctx.request.body;
    const result = await User.findOne({ username, password });
    const data = result._doc;
    if (data) {
      const token = jwt.sign(
        {
          data,
        },
        secret,
        { expiresIn: 30 }
      );
      ctx.body = success({ ...data, token }, '登录成功');
    } else {
      ctx.body = fail('用户名或密码错误');
    }
  } catch (error) {
    ctx.body = fail(error.msg);
  }
});

router.get('/leave/notice', async (ctx) => {
  try {
    const token = ctx.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, secret);
    ctx.body = success(payload, '获取成功');
  } catch (error) {
    ctx.body = fail(error.msg);
  }
});

module.exports = router;
