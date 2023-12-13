/**
 * 通用工具函数
 */
const { error, info } = require('./log4.js');
const CODE = {
  SUCCESS: 200,
  ERROR: 500,
  PARAM_ERROR: 10001, // 参数错误
  USER_ACCOUNT_ERROR: 20001, // 账号或密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登录
  BUSINESS_ERROR: 40001, // 业务请求失败
  AUTH_ERROR: 50001, // 认证失败或token错误
};

module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum
   * @param {number} pageSize
   */

  pager(pageNum = 1, pageSize = 1) {
    pageNum *= 1;
    pageSize *= 1;
    const skipIndex = (pageNum - 1) * pageSize;
    return {
      pageNum,
      pageSize,
      skipIndex,
    };
  },

  success(data = '', msg = '', code = CODE.SUCCESS) {
    console.log({
      code,
      data,
      msg,
    });
    info(msg);
    return {
      code,
      data,
      msg,
    };
  },
  fail(msg = '', code = CODE.ERROR) {
    error(msg);
    return {
      code,
      data: null,
      msg,
    };
  },
};
