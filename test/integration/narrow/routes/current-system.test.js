const { crumbToken } = require('./test-helper')

describe('Page: /current-system', () => {
  let varList = {
    poultryType: 'hen',
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
      url: `${global.__URLPREFIX__}/current-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of hen housing system do you currently use?')
    expect(response.payload).toContain('Colony cage')
    expect(response.payload).toContain('Combi-cage')
    expect(response.payload).toContain('Indoor (floor or flat-deck)')
    expect(response.payload).toContain('Outdoor (floor or flat-deck)')
    expect(response.payload).toContain('Indoor (aviary)')
    expect(response.payload).toContain('Outdoor (aviary)')
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

  it('user selects eligible option -> store user response and redirect to /ramp-connection', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/current-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { currentSystem: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('ramp-connection')
  })

  it('page loads with correct back link - /external-taps', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/current-system`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"remaining-costs\" class=\"govuk-back-link\">Back</a>')
  })
})
