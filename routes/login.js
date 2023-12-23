/**
 * 用户管理模块
 */
const router = require('koa-router')();
// 导入数据库集合
const User = require('../models/userSchema');
const { success, fail } = require('../utils/useTool');
// 导入jwt库
const jwt = require('jsonwebtoken');
// 加密配置
const { secret, expiresIn } = require('../config');

router.post('/login', async (ctx) => {
  console.log(1);
  try {
    const { username, password } = ctx.request.body;
    const result = await User.findOne({ username, password }, 'userId userName userEmail state role depId roleList');
    console.log(result);
    if (result) {
      const data = result._doc;
      if (data) {
        const token = jwt.sign(
          {
            data,
          },
          secret,
          { expiresIn }
        );
        ctx.body = success({ ...data, token }, '登录成功');
      } else {
        ctx.body = fail('用户名或密码错误');
      }
    }
  } catch (error) {
    ctx.body = fail(error.msg);
  }
});

module.exports = router;
