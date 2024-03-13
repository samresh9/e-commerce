import { createLogger, format, transports } from 'winston';

const consoleFormat = format.combine(
  format.timestamp(),
  format.colorize(),
  format.json(),
  format.printf((info) => {
    //  console.log(info, 'infooooo');
    let message = `${info.timestamp} [${info.level}] ${info.message}\n `; // Add newline character
    if (info.stack) {
      message += `${info.stack}\n`;
    }
    return message;
  }),
);

const fileFormat = format.combine(format.timestamp(), format.prettyPrint());
const options = {
  format: format.combine(format.timestamp(), format.prettyPrint()),
  level: 'info',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({ filename: './log/combined.log', format: fileFormat }),
    new transports.File({
      filename: './log/error.log',
      level: 'error',
      format: fileFormat,
    }),
  ],
};

export const logger = createLogger(options);
