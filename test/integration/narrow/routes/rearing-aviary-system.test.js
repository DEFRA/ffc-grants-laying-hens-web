const { crumbToken } = require('./test-helper')

describe('Page: /rearing-aviary-system', () => {
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
      url: `${global.__URLPREFIX__}/rearing-aviary-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will your rearing aviary system have these features?')
    expect(response.payload).toContain('The rearing aviary system must have:')
    expect(response.payload).toContain('the capacity to provide or retain friable litter while the birds are held within the system<')
    expect(response.payload).toContain('an integrated manure removal belt-system')
    expect(response.payload).toContain('integrated height-adjustable feed lines, nipple drinkers and platforms')
    expect(response.payload).toContain('integrated and fully dimmable non-flicker LED lighting')
    expect(response.payload).toContain('welfare ramps when the pullets are 14 days old')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/rearing-aviary-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if your rearing aviary system will have these features')
  })

  it('user selects eligible option -> store user response and redirect to /mechanical-ventilation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/rearing-aviary-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { rearingAviarySystem: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('mechanical-ventilation')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/rearing-aviary-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { rearingAviarySystem: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The rearing aviary system must have:')
    expect(postResponse.payload).toContain('the capacity to provide or retain friable litter while the birds are held within the system')
    expect(postResponse.payload).toContain('an integrated manure removal belt-system')
    expect(postResponse.payload).toContain('integrated height-adjustable feed lines, nipple drinkers and platforms')
    expect(postResponse.payload).toContain('integrated and fully dimmable non-flicker LED lighting')
    expect(postResponse.payload).toContain('welfare ramps when the pullets are 14 days old')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /multi-tier-system', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/rearing-aviary-system`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"multi-tier-system\" class=\"govuk-back-link\">Back</a>')
  })
})
