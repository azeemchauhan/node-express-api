import dotenv from 'dotenv';
import app from '../src/app';
import db from '@config/database';

jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../src/app', () => ({ listen: jest.fn() }));
jest.mock('@config/database', () => ({ authenticate: jest.fn(), }));


describe('initServer', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => { 
    process.env = originalEnv; 
  });

  it('should authenticate with the database and start the server', async () => {
    const mockAuthenticate = db.authenticate;
    const mockListen = app.listen;
    process.env.PORT = '3001';
    
    import(`../src/server`)
      .then((_module) => {
        expect(dotenv.config).toHaveBeenCalled();
        expect(mockAuthenticate).toHaveBeenCalled();
        expect(mockListen).toHaveBeenCalledWith('3001', expect.any(Function));
      });
  });

  it('should log an error and exit if app listen fails', async () => {
    jest.mock('../src/app', () => ({ listen: () => { throw new Error('Listen error') } }));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => false);
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
    
    jest.resetModules()

    import(`../src/server`)
      .then((_module) => {
        const errorMessage = 'An error occurred: {}'
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
        consoleErrorSpy.mockRestore();
        processExitSpy.mockRestore();
      })
  });
});
