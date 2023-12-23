/**
 * 数据库连接
 */

const mongoose = require('mongoose');
const config = require('./index');
const { info, error } = require('../utils/log4');

// 建立链接
mongoose.connect(config.URL, {
  // user: 'root',
  // pass: '123456',
});
const db = mongoose.connection;


db.on('error', () => {
  error('数据库连接失败');
});

db.on('open', () => {
  info('数据库连接成功');
});
