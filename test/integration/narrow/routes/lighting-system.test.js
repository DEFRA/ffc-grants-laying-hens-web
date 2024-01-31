const { crumbToken } = require('./test-helper')

describe('Page: /lighting-system', () => {
  const varList = {}

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
      url: `${global.__URLPREFIX__}/lighting-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the housing lighting system provide non-flicker light from dimmable LEDs?')
    expect(response.payload).toContain('Housing lighting must be ceiling-mounted and cover the whole barn area including the floor litter')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the lighting system will provide non-flicker light from dimmable LEDs')
  })

  it('user selects eligible option -> store user response and redirect to /lighting-features', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingSystem: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('lighting-features')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingSystem: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('Housing lighting must be ceiling-mounted and cover the whole barn area including the floor litter.')
    expect(postResponse.payload).toContain('The lighting must be able to provide:')
    expect(postResponse.payload).toContain('non-flicker light between approximately 3000 Kelvin and 4000 Kelvin colour temperature')
    expect(postResponse.payload).toContain('zonal dimming between 0 lux and 60 lux')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-system`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"ventilation-air-quality\" class=\"govuk-back-link\">Back</a>')
  })

})
