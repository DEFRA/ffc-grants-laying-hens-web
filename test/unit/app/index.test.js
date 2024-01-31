const createServer = require('./../../../app/server');

jest.mock('./../../../app/server', () => {
    return jest.fn().mockResolvedValue({
        start: jest.fn(),
        stop: jest.fn(),
        info: { uri: 'http://localhost:3000' }
    })
});

describe('init', () => {

    let server

  beforeEach(async () => {
    logSpy = jest.spyOn(console, 'log')
    process.exit = jest.fn();
    server = await createServer()
  });

  test('should start the server', async () => {
    await require('./../../../app/index');
    expect(server.start).toHaveBeenCalled();
  });

  test('should log the server uri', async () => {
    await require('./../../../app/index');
    expect(logSpy).toHaveBeenCalledWith('Server running on %s', server.info.uri);
  });

  test('should handle unhandled rejections', async () => {
    const error = new Error('unhandled rejection');
    await require('./../../../app/index');
    process.emit('unhandledRejection', error);
    expect(logSpy).toHaveBeenCalledWith(error);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});