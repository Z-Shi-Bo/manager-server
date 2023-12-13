/**
 * 用户管理模块
 */
const router = require('koa-router')();
// 导入数据库集合
const User = require('../models/userSchema');
const { success, fail } = require('../utils/useTool');

router.prefix('/users');

router.post('/login', async (ctx) => {
  try {
    const { username, password } = ctx.request.body;
    const result = await User.findOne({ username, password });
    if (result) {
      ctx.body = success(result, '登录成功');
    } else {
      ctx.body = fail('用户名或密码错误');
    }
  } catch (error) {
    ctx.body = fail(error.msg);
  }
});

module.exports = router;
