const { crumbToken } = require('./test-helper')

describe('Page: /aviary-lighting-system', () => {

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
      url: `${global.__URLPREFIX__}/aviary-lighting-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the aviary system have an integrated LED lighting system?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-lighting-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the aviary system will have an integrated LED lighting system')
  })

  it('user selects eligible option -> store user response and redirect to /mechanical-ventilation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-lighting-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviaryLightingSystem: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('mechanical-ventilation')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-lighting-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviaryLightingSystem: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The aviary system must have an integrated LED lighting system.')
    expect(postResponse.payload).toContain('The lighting system must have non-flicker lighting and zonal dimming to provide an automated dawn and dusk.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/aviary-lighting-system`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"manure-removal\" class=\"govuk-back-link\">Back</a>')
  })

})
