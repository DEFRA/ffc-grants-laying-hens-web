const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /step-up-system', () => {
  let varList = {}
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/step-up-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the step-up system have these features?')
    expect(response.payload).toContain('The step-up system must have:')
    expect(response.payload).toContain('height-adjustable tiers that may include food and water at, or before, 10 days')
    expect(response.payload).toContain('welfare ramps')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if your step-up system will have these features',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/step-up-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the step-up system will have these features')
  })

  it('user selects eligible option -> store user response and redirect to /housing-density', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/step-up-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { stepUpSystem: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('housing-density')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/step-up-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { stepUpSystem: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The step-up system must have:')
    expect(postResponse.payload).toContain('height-adjustable tiers that may include food and water at, or before, 10 days')
    expect(postResponse.payload).toContain('welfare ramps')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /multi-tier-system', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/step-up-system`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"multi-tier-system\" class=\"govuk-back-link\">Back</a>')
  })
})
