const mongoose = require('mongoose');

// 定义数据模型
const RoleSchema = new mongoose.Schema({
  roleName: String, // 角色名称
  remark: String, // 备注
  permissionList: {
    checkedKeys: [mongoose.Types.ObjectId], // 选中的权限节点
    halfCheckedKeys: [mongoose.Types.ObjectId], // 选中的权限节点的父节点
  }, // 权限列表
  createTime: {
    type: Date,
    default: Date.now(),
  }, // 创建时间
});

module.exports = mongoose.model('role', RoleSchema, 'roles');
