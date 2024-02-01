const { crumbToken } = require('./test-helper')
const bcrypt = require('bcrypt');

describe('login page', () => {
  const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  beforeEach(() => {
    bcryptSpy = jest.spyOn(bcrypt, 'compareSync')
  })

  afterEach(() => {
    bcryptSpy.mockRestore();
  });

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/login`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('login')
  })

  it('login with correct username but incorrect password', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/login`,
      payload: { username: 'test_username', password: 'password', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(() => require('../../../app/routes/login')).toThrow()
  })

  it('login with correct password but incorrect username', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/login`,
      payload: { username: 'hello', password: '12345', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    bcryptSpy.mockReturnValue(true);

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(() => require('../../../app/routes/login')).toThrow()
  })

  it('login with incorrect details goes to fail action', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/login`,
      payload: { username: 'username', password: 'password', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('login')
  })

  it('redirect to /start when entering correct details', async () => {

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/login`,
      payload: { username: 'test_username', password: '12345', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    global.__SERVER__.ext('onPreAuth', (request, h) => {
      request.cookieAuth = { set: jest.fn() };
      return h.continue;
    });

    bcryptSpy.mockReturnValue(true);
    
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/laying-hens/start')
  })
})
