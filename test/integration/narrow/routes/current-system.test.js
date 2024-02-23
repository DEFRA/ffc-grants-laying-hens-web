const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /current-system', () => {
  let varList = {
    poultryType: 'hen',
  }
  
  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/current-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of hen housing system do you currently use in the building?')
    expect(response.payload).toContain('Colony cage')
    expect(response.payload).toContain('Combi-cage')
    expect(response.payload).toContain('Barn')
    expect(response.payload).toContain('Free range')
    expect(response.payload).toContain('Organic')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/current-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what type of hen housing system you currently use')
  })

  it('user selects eligible option(Combi cage) -> store user response and redirect to /current-multi-tier-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/current-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { currentSystem: 'Combi cage',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('current-multi-tier-system')
  })

  it('user selects eligible option except Combi cage -> store user response and redirect to /ramp-connection', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/current-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { currentSystem: 'Colony cage',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('ramp-connection')
  })

  it('page loads with correct back link - /remaining-costs', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/current-system`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"remaining-costs\" class=\"govuk-back-link\">Back</a>')
  })
})
