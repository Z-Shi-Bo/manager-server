/**
 * 用户管理模块
 */
const router = require('koa-router')();
// 导入数据库集合
const User = require('../models/userSchema');
const { success, fail } = require('../utils/useTool');
// 导入jwt库
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// 加密配置
const { secret, expiresIn } = require('../config');

// 对密码进行MD5哈希
function md5Hash(password) {
  const md5 = crypto.createHash('md5');
  return md5.update(password).digest('hex');
}

router.post('/login', async (ctx) => {
  console.log(1);
  try {
    const { userName, password } = ctx.request.body;
    const result = await User.findOne({ userName }, 'userId password userName userEmail state role depId roleList');
    if (result) {
      console.log(md5Hash(password));
      console.log(result.password);
      if (md5Hash(password) !== result.password) {
        ctx.body = fail('密码错误');
        return;
      }
      const data = result._doc;
      if (data) {
        const token = jwt.sign(
          {
            data,
          },
          secret,
          { expiresIn }
        );
        delete data.password;
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
