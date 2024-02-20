const { crumbToken } = require('./test-helper')

describe('Page: /current-system', () => {
  let varList = {}
  
  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/ramp-connection`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will every level of the multi-tier system be connected to another level by a ramp?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/ramp-connection`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if every level of the multi-tier system will be connected to another level by a ramp')
  })

  it('user selects eligible option -> store user response and redirect to /maximum-tier-height', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/ramp-connection`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { rampConnection: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('maximum-tier-height')
  })

  it('page loads with correct back link - /current-system', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/ramp-connection`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"current-system\" class=\"govuk-back-link\">Back</a>')
  })
})
