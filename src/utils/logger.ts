import winston from "winston";

export default winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [ new winston.transports.File({filename: 'err'}) ]
});