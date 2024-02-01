const { plugin } = require('./../../../app/plugins/header');

describe('header plugin', () => {
  it('should set headers correctly', () => {
    const server = {
      ext: jest.fn()
    };

    const options = {
      keys: [
        { key: 'X-Test-Header', value: 'Test value' }
      ]
    };

    plugin.register(server, options);

    // Call the onPreResponse function with a Boom response
    const onPreResponse = server.ext.mock.calls[0][1];
    const boomResponse = { isBoom: true, output: { headers: {} } };
    onPreResponse({ response: boomResponse }, { continue: 'continue' });
    expect(boomResponse.output.headers['X-Test-Header']).toBe('Test value');

    // Call the onPreResponse function with a non-Boom response
    const normalResponse = { isBoom: false, header: jest.fn() };
    onPreResponse({ response: normalResponse }, { continue: 'continue' });
    expect(normalResponse.header).toHaveBeenCalledWith('X-Test-Header', 'Test value');
  });
});