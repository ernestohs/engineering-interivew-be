import winston from 'winston';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
/**
 * TODO: Integrate with DataDog
 * @example 
 * import * as ddTransport from 'datadog-winston';
 */

const { combine, timestamp, printf, errors } = format;

// Define custom format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Environment-specific options
const getLogTransports = () => {
  const commonTransports = [
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
  ];

  const transportsList = [
    ...commonTransports,
    new winston.transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ];

  /**
   * TODO: Use this code as reference once it is integrated with DataDog
   * @example
   * if (process.env.NODE_ENV === 'production') {
   *     transportsList.push(
   *     new ddTransport.DatadogTransport({
   *         apiKey: process.env.DD_API_KEY || 'your_datadog_api_key',
   *         service: 'your_service_name',
   *         ddsource: 'nodejs',
   *         ddtags: `env:${process.env.NODE_ENV}`,
   *     })
   *     );
   * }
   */

  return transportsList;
};

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    format.colorize(),
    timestamp(),
    errors({ stack: true }), // Log the full stack trace
    logFormat
  ),
  transports: getLogTransports(),
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export default logger;
