
describe('polling.js', () => {
  const value = require('../../../app/config/polling')

  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  xtest('check polling config', () => {
    const {
      POLLING_INTERVAL,
      POLLING_RETRIES,
      BACKEND_POLLING_HOST
    } = process.env
    
    expect(value).toEqual({
      interval: Number(POLLING_INTERVAL),
      retries: Number(POLLING_RETRIES),
      host: BACKEND_POLLING_HOST
    })
  })

  test('Invalid env var throws error', () => {
    process.env.POLLING_INTERVAL = 'testing'
    process.env.POLLING_RETRIES = 'HELLO'
    process.env.BACKEND_POLLING_HOST = 45

    expect(() => require('../../../app/config/polling')).toThrow()
  })
})
