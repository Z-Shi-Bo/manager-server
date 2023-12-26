/**
 * 菜单管理模块
 */

const router = require('koa-router')();
// 导入数据库模型
const Menu = require('../models/menuSchema');
const { success, fail } = require('../utils/useTool');

// 接口前缀
router.prefix('/menus');

// 获取菜单列表支持模糊查询
router.get('/list', async (ctx) => {
  const { menuName, menuState } = ctx.request.query;
  const params = {};
  let regex = '';
  // 模糊查询
  if (menuName) {
    regex = new RegExp(menuName, 'i');
  }
  if (menuState) params.menuState = menuState;
  const result = (await Menu.find({ ...params, menuName: { $regex: regex } })) || [];
  if (result) {
    const treeMenu = getTreeMenu(result, null, []);
    ctx.body = success({ list: treeMenu }, '查询成功');
    return;
  }
  ctx.body = fail('查询失败');
});

// 递归调用根据parentId拼接树形菜单
const getTreeMenu = (menuList, id, list) => {
  for (let i = 0; i < menuList.length; i++) {
    const item = menuList[i];
    if (String(item.parentId.at(-1)) === String(id)) {
      list.push(item._doc);
    }
  }

  list.map((item) => {
    item.children = [];
    getTreeMenu(menuList, item._id, item.children);
    if (item.children.length === 0) {
      delete item.children;
    } else if (item.children.length > 0 && item.children[0].menuType === 2) {
      item.action = item.children[0];
    }
  });
  return list;
};

// 新增菜单
router.post('/add', async (ctx) => {
  const { ...params } = ctx.request.body;
  try {
    const result = await Menu.create(params);
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
    params.updateTime = Date.now();
    // 更新数据库
    const result = await Menu.findByIdAndUpdate(_id, params);
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
    const result = await Menu.findByIdAndDelete(_id);
    await Menu.deleteMany({ parentId: { $all: [_id] } });
    if (result) {
      ctx.body = success({}, '删除成功');
      return;
    }
    ctx.body = fail('删除失败');
  } catch (error) {
    ctx.body = fail(error);
  }
});

module.exports = router;
