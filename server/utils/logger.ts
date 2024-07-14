import winston, { format } from "winston";

interface Logger {
  error(message: string, ...rest: any[]): void;
  warn(message: string, ...rest: any[]): void;
  info(message: string, ...rest: any[]): void;
  debug(message: string, ...rest: any[]): void;
}

const getModuleName = (callingModule?: NodeModule) => {
  if (!callingModule) {
    return "";
  }
  if (!callingModule.filename) {
    return callingModule.id;
  }
  const parts = callingModule.filename.split("/");
  return `${parts[parts.length - 2]}/${parts.pop()}`;
};

const createLogger = (callingModule?: NodeModule): Logger => {
  const logger = winston.createLogger({
    exitOnError: false,
  });

  const label = getModuleName(callingModule);
  const level = "info";

  if (level) {
    logger.add(
      new winston.transports.Console({
        level,
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.label({ label }),
          format((info) => {
            info.ctx = "context";
            return info;
          })(),
          format.printf((info) => {
            return `${info.timestamp} ${info.level.padStart(16)} ${info.ctx} ${
              info.label
            }: ${info.message}`;
          })
        ),
      })
    );
  }

  return {
    error: (message: string, ...rest: any[]) => {
      logger.error(message, ...rest);
    },
    warn: (message: string, ...rest: any[]) => {
      logger.warn(message, ...rest);
    },
    info: (message: string, ...rest: any[]) => {
      logger.info(message, ...rest);
    },
    debug: (message: string, ...rest: any[]) => {
      logger.debug(message, ...rest);
    },
  };
};

export { createLogger, Logger };
