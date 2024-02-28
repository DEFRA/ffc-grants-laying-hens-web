const { crumbToken } = require('./test-helper')

describe('Page: /aviary-system', () => {
  const varList = {}

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/aviary-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the aviary system have these features?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the aviary system will have these features')
  })

  it('user selects eligible option -> store user response and redirect to /mechanical-ventilation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviarySystem: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('mechanical-ventilation')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviarySystem: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('automatic manure removal belts')
    expect(postResponse.payload).toContain('non-flicker LED lighting at each level (including under the system) capable of automatically simulating dawn and dusk')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/aviary-system`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"aviary-welfare\" class=\"govuk-back-link\">Back</a>')
  })

})
