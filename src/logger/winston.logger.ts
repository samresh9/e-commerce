import { createLogger, format, transports } from 'winston';

const options = {
  format: format.combine(format.timestamp(), format.prettyPrint()),
  level: 'info',
  transports: [
    new transports.Console(),
    new transports.File({ filename: './log/combined.log' }),
  ],
};

export const logger = createLogger(options);
