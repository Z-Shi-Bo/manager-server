/**
 * 配置数据库连接路径
 */

module.exports = {
  URL: 'mongodb://127.0.0.1:27017/study', // 链接数据库地址
  secret: 'abcdefghijklmnopqrstuvwxyz1234567890', // 加密密钥
  expiresIn: '1day', // token过期时间
};