/**
 * 用户管理模块
 */
const router = require('koa-router')();
// 导入数据库集合
const Dept = require('../models/deptSchema');
const { success, fail, pager } = require('../utils/useTool');
router.prefix('/depts');

// 获取部门列表
router.get('/list', async (ctx) => {
  try {
    const { pageNum, pageSize, deptName } = ctx.request.query;
    const skipIndex = pager(pageNum, pageSize);
    const params = {};
    if (deptName) params.deptName = deptName;
    // 第二个参数可以控制那些字段返回，那些不返回
    const list = await Dept.find(params).skip(skipIndex).limit(pageSize).sort({ userId: 1 });
    const total = await Dept.countDocuments(params);
    ctx.body = success({ list, total, pageNum, pageSize }, '获取成功');
  } catch (error) {
    ctx.body = fail(`查询异常：${error.stack}`);
  }
});

// 根据userId数组来修改对应的用户状态为2
router.post('/delete', async (ctx) => {
  try {
    const { userIds } = ctx.request.body;
    if (!userIds) {
      ctx.body = fail('请选择要删除的用户');
      return;
    }
    const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 });
    if (res.modifiedCount) {
      ctx.body = success({ code: res.code }, `共删除${res.modifiedCount}条`);
      return;
    }
    ctx.body = fail('删除失败');
  } catch (error) {
    ctx.body = fail(`删除异常：${error.stack}`);
  }
});

// 根据userId,userName,userEmail,mobile,job,state,roleList,deptId字段来新增用户信息
router.post('/add', async (ctx) => {
  try {
    const { userId, userName, userEmail, mobile, job, state, roleList, deptId, role } = ctx.request.body;
    if (!userName || !userEmail || !deptId) {
      ctx.body = fail('请填写完整信息');
      return;
    }
    const res = await User.findOne({ $or: [{ userName }, { userEmail }] });
    if (res) {
      ctx.body = fail('用户名或邮箱已存在');
      return;
    }
    // 用户id维护在userId表中
    const doc = await UserId.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true });
    const user = await new User({ userId: doc.sequence_value, userName, userEmail, mobile, job, state, roleList, deptId, role, password: md5('123456') });
    await user.save();
    ctx.body = success({}, '新增成功');
  } catch (error) {
    ctx.body = fail(`新增异常：${error.stack}`);
  }
});

// 根据userId,userName,userEmail,mobile,job,state,roleList,deptId字段来修改用户信息
router.post('/update', async (ctx) => {
  try {
    const { userId, userName, userEmail, mobile, job, state, roleList, deptId, role } = ctx.request.body;
    if (!userName || !userEmail || !deptId) {
      ctx.body = fail('请填写完整信息');
      return;
    }
    await User.findOneAndUpdate({ userId }, { mobile, job, state, roleList, deptId, role });
    ctx.body = success({}, '修改成功');
  } catch (error) {
    ctx.body = fail(`修改异常：${error.stack}`);
  }
});
module.exports = router;
