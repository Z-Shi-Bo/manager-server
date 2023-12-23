/**
 * 用户管理模块
 */
const router = require('koa-router')();
// 导入数据库集合
const User = require('../models/userSchema');
const { success, fail, pager } = require('../utils/useTool');
// 导入jwt库
const jwt = require('jsonwebtoken');
// 加密配置
const { secret } = require('../config');
router.prefix('/users');

router.get('/leave/notice', async (ctx) => {
  try {
    const token = ctx.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, secret);
    ctx.body = success(payload, '获取成功');
  } catch (error) {
    ctx.body = fail(error);
  }
});

// 获取用户列表
router.get('/list', async (ctx) => {
  try {
    const { pageNum, pageSize, userId, userName, state } = ctx.request.query;
    const skipIndex = pager(pageNum, pageSize);
    const params = {};
    if (userId) params.userId = userId;
    if (userName) params.userName = userName;
    if (state && state - 0 !== 0) params.state = state;
    // 第二个参数可以控制那些字段返回，那些不返回
    const list = await User.find(params, { _id: 0, password: 0 }).skip(skipIndex).limit(pageSize);
    const total = await User.countDocuments(params);
    ctx.body = success({ list, total, pageNum, pageSize }, '获取成功');
  } catch (error) {
    ctx.body = fail(error);
  }
});

module.exports = router;
