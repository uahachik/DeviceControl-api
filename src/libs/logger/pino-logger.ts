import { FastifyReply, FastifyRequest } from 'fastify';
import { SerializerFn } from 'pino';
import ErrorReplyLogger from './reply/error-reply-logger';

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",

  reset: "\u001b[0m",
  bold: "\u001b[1m",
  dim: "\u001b[2m",
  italic: "\u001b[3m",
  underline: "\u001b[4m",
  blink: "\u001b[5m",
  inverse: "\u001b[7m",
  hidden: "\u001b[8m",

  rightBlackBackground: "\u001b[100m",
  rightRedBackground: "\u001b[101m",
  rightGreenBackground: "\u001b[102m",
  rightYellowBackground: "\u001b[103m",
  rightBlueBackground: "\u001b[104m",
  rightMagentaBackground: "\u001b[105m",
  rightCyanBackground: "\u001b[106m",
  rightWhiteBackground: "\u001b[107m",
};

const devLoggerConfig = {
  file: 'logs/pino.logs',
  // serializers: {
  // req: (request => {
  //   return {
  //     method: request.method,
  //     url: request.url,
  //   };
  // }) as SerializerFn,
  // res: (reply => {
  //   return {
  // statusCode: reply.statusCode,
  // responseTime: reply.responseTime,
  //   };
  // }) as SerializerFn,
  // responseTime: (reply => {
  //   return {
  //     responseTime: reply.responseTime,
  //   };
  // }) as SerializerFn,
  // },
  formatters: {
    level: (label: string) => ({ level: label }),
    bindings: () => ({}),
    log: (object: Record<string, unknown>) => {
      const objReq = object.req as FastifyRequest;
      const objRes = object.res as FastifyReply;
      const objWarn = object?.warn as ErrorReplyLogger;
      const objError = object?.error as ErrorReplyLogger;

      /*
       * Fastify Request Reply logger
       */
      const requestInfo = objReq
        ? `${colors.reset}${colors.italic}Request:${colors.blue} method: ${objReq.method} url: ${objReq.url}${colors.reset}`
        : '';
      const replyInfo = object.res && object.responseTime
        ? `${colors.reset}${colors.italic}Response:${colors.blue} status: ${objRes.statusCode} time: ${object.responseTime as string}${colors.reset}`
        : '';
      /*
       * plugin logger messages
       */
      const infoMsg = `${colors.bold}${colors.green}${object.msg}${colors.reset} `;
      const warnMsg = `${colors.bold}${colors.yellow}${object.msg}${colors.reset}`;
      const errorMsg = `${colors.bold}${colors.red}${object.msg}${colors.reset}`;
      const loggerMsg = object.msg ? chooseLevelLog(infoMsg, warnMsg, errorMsg) : '';

      /*
       * plugin logger info
       */
      const infoData = object.data ? `${colors.cyan}${JSON.stringify(object.data)}${colors.reset} ` : '';

      /*
       * plugin logger warn/error details
       */
      let message = '';
      let cause = '';
      let name = '';
      let stack = '';
      if (objWarn) {
        message = ` Message: ${colors.yellow}"${objWarn.message}"${colors.reset}`;
        cause = ` Cause: ${colors.yellow}"${objWarn.cause}"${colors.reset}`;
        name = ` Name: ${colors.yellow}"${objWarn.name}"${colors.reset}`;
        stack = ` Original Stack: ${colors.yellow}"${objWarn?.stack}"${colors.reset} `;
      }
      if (objError) {
        message = ` Message: ${colors.underline}"${objError.message}"${colors.reset}`;
        cause = ` Cause: ${colors.underline}"${objError.cause}"${colors.reset}`;
        name = ` Name: ${colors.underline}"${objError.name}"${colors.reset}`;
        stack = ` Original Stack: ${colors.underline}"${objError?.stack}"${colors.reset} `;
      }
      // const detail = objError?.detail ? ` Detail: "${objError.detail}"` : '';
      const errorDetails = message + cause + name + stack;

      /*
       * plugin logger opts
       */
      const infoOpts = `${colors.green}${colors.dim}${JSON.stringify(object.opts)}${colors.reset}`;
      const warnOpts = `${colors.yellow}${colors.dim}${JSON.stringify(object.opts)}${colors.reset}`;
      const errorOpts = `${colors.red}${JSON.stringify(object.opts)}${colors.reset}`;
      const loggerOpts = object.opts ? chooseLevelLog(infoOpts, warnOpts, errorOpts) : '';

      function chooseLevelLog(info: string, warn: string, error: string) {
        let log = info;
        if (objWarn) {
          log = warn;
        } else if (objError) {
          log = error;
        }
        return log;
      };

      /*
       * logger output
       */
      const logsOutput = `${requestInfo}${replyInfo}${loggerMsg ? loggerMsg : ''}${infoData}${errorDetails}${loggerOpts}`;
      return ({
        logsOutput,
      });
    }
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname',
      singleLine: true,
      messageKey: "logsOutput",
    }
  }
};

const prodLoggerConfig = {
  level: 'info',
  redact: ['req.headers.authorization'],
  serializers: {
    req: (request => {
      return {
        method: request.method,
        url: request.url,
      };
    }) as SerializerFn,
    res: (reply => {
      return {
        statusCode: reply.statusCode,
      };
    }) as SerializerFn,
  },
  transport: {
    // TODO: production transport with pino-logflare
    target: 'pino-logflare',
    options: {
      apiKey: 'YOUR_LOGFLARE_API_KEY',
      sourceToken: 'YOUR_LOGFLARE_SOURCE_TOKEN',
      level: 'info', // Set log level (optional)
      app: 'YOUR_APP_NAME', // Optional: specify your app name
      host: 'logs.logflare.com', // Optional: specify Logflare host
      path: '/api/logs/:sourceToken', // Optional: specify Logflare endpoint path
      timeout: 1000, // Optional: specify request timeout in milliseconds
    }
  }
};

export default process.env.NODE_ENV === 'prod' ? prodLoggerConfig : devLoggerConfig;