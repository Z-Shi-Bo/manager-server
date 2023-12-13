const log4js = require('log4js');

const levels = {
  trace: log4js.levels.TRACE,
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL,
};

log4js.configure({
  appenders: {
    default: { type: 'console' },
    info: {
      type: 'file',
      filename: 'logs/info.log',
    },
    error: {
      type: 'dateFile',
      filename: 'logs/error',
      pattern: 'yyyy-MM-dd-hh.log',
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ['default'], level: 'debug' },
    info: { appenders: ['info'], level: 'info' },
    error: {
      appenders: ['error'],
      level: 'error',
    },
  },
});

function loggerType(ctx, type, content) {
  ctx.level = levels[type];
  console.log(content);
  return ctx[type](content);
}

exports.debug = (content) => {
  const logger = log4js.getLogger();
  return loggerType(logger, 'debug', content);
};

exports.info = (content) => {
  const logger = log4js.getLogger('info');
  return loggerType(logger, 'info', content);
};

exports.error = (content) => {
  const logger = log4js.getLogger('error');
  return loggerType(logger, 'error', content);
};
