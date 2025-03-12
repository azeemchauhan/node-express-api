import winston from 'winston';

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    json: jest.fn(),
  },
  transports: {
    File: jest.fn(),
  },
}));

describe('Logger', () => {
  it('should create a Winston logger with correct configuration', () => {
    import(`@utils/logger`)
      .then((_module) => {
        expect(winston.createLogger).toHaveBeenCalledWith({
          level: 'error',
          format: winston.format.json(),
          transports: [
            new winston.transports.File({ filename: 'err' }),
          ],
        });
      })
  });
});