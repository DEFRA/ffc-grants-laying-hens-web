const { crumbToken } = require('./test-helper')

describe('login page', () => {
  const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))
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

  // bcrypt.compareSync how to test
  xit('login with correct username but incorrect password', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/login`,
      payload: { username: 'username', password: 'password', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toBe('ok')
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

  // bcrypt.compareSync how to test
  xit('redirect to /start when entering correct details', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/login`,
      payload: { username: 'some conscent', password: 'password', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('start')
  })
})
