const mongoose = require('mongoose');

// 定义菜单管理数据库模型
const MenuSchema = new mongoose.Schema({
  menuType: Number, // 菜单类型，1表示菜单，2表示按钮
  menuName: String, // 菜单名称
  path: String, // 路由地址
  component: String, // 组件地址
  icon: String, // 菜单图标
  menuState: Number, // 菜单状态
  menuCode: String, // 权限标识
  parentId: [mongoose.Types.ObjectId], // 父级Id
  createTime: {
    type: Date,
    default: Date.now(),
  }, // 创建时间
  updateTime: {
    type: Date,
    default: Date.now(),
  }, // 更新时间
});

module.exports = mongoose.model('menu', MenuSchema, 'menus');
