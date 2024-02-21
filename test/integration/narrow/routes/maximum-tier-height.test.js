const { crumbToken } = require('./test-helper')

describe('Page: /maximum-tier-height', () => {
  let varList = {
    poultryType: 'hen'
  }
  
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
      url: `${global.__URLPREFIX__}/maximum-tier-height`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the highest tier with direct access to the floor be 2 metres high or less?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/maximum-tier-height`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the highest tier with direct access to the floor will be 2 metres high or less')
  })

  it('user selects eligible option -> store user response and redirect to /three-tiers', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/maximum-tier-height`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { maximumTierHeight: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('three-tiers')
  })

  it('page loads with correct back link - /ramp-connection', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/maximum-tier-height`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"ramp-connection\" class=\"govuk-back-link\">Back</a>')
  })
})
