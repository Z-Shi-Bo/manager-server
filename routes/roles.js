/**
 * 菜单管理模块
 */

const router = require('koa-router')();
// 导入数据库模型
const Role = require('../models/roleSchema');
const { success, fail, pager } = require('../utils/useTool');

// 接口前缀
router.prefix('/roles');

// 获取菜单列表支持模糊查询
router.get('/list', async (ctx) => {
  const { roleName, pageNum, pageSize } = ctx.request.query;
  const skipIndex = pager(pageNum, pageSize);
  let regex = '';
  // 模糊查询
  if (roleName) {
    regex = new RegExp(roleName, 'i');
  }
  const total = await Role.countDocuments({ roleName: { $regex: regex } });
  if (total > 0) {
    const list =
      (await Role.find({ roleName: { $regex: regex } })
        .skip(skipIndex)
        .limit(pageSize)) || [];
    ctx.body = success({ list, total, pageNum, pageSize }, '查询成功');
    return;
  }
  ctx.body = fail(`查询失败: ${error.stack}`);
});

// 新增菜单
router.post('/add', async (ctx) => {
  const { _id, ...params } = ctx.request.body;
  try {
    const result = await Role.create(params);
    if (result) {
      ctx.body = success({}, '新增成功');
      return;
    }
    ctx.body = fail('新增失败');
  } catch (error) {
    ctx.body = fail(error);
  }
});

// 编辑菜单
router.post('/update', async (ctx) => {
  const { _id, ...params } = ctx.request.body;
  try {
    // 更新数据库
    const result = await Role.findByIdAndUpdate(_id, params);
    if (result) {
      ctx.body = success({}, '更新成功');
      return;
    }
    ctx.body = fail('新增失败');
  } catch (error) {
    ctx.body = fail(error);
  }
});
// 删除菜单
router.post('/delete', async (ctx) => {
  const { _id } = ctx.request.body;
  try {
    const result = await Role.findByIdAndDelete(_id);
    // 删除成功
    if (result) {
      ctx.body = success({}, '删除成功');
      return;
    }
    ctx.body = fail('删除失败');
  } catch (error) {
    ctx.body = fail(error);
  }
});

// 设置用户权限
router.post('/setPermission', async (ctx) => {
  const { _id, permissionList } = ctx.request.body;
  try {
    const result = await Role.findByIdAndUpdate(_id, { permissionList });
    if (result) {
      ctx.body = success({}, '设置成功');
      return;
    }
    ctx.body = fail('设置失败');
  } catch (error) {
    ctx.body = fail(error);
  }
});

module.exports = router;
