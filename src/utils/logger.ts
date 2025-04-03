import winston from "winston";

/**
 * We can transport the logs to external Server ( e.g Datadog )
 * check `winston` for more details
 */
export default winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [ new winston.transports.File({filename: 'application.logs'}) ]
});