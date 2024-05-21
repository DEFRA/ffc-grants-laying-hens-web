const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /pullet-housing-requirements', () => {
  let varList = {
    projectType: 'Replacing the entire building with a new building'
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullet housing have these features?')
    expect(response.payload).toContain('When the project is complete, the building must have:')
    expect(response.payload).toContain('a useable area provided at multiple bird-accessible heights from 10 days of age')
    expect(response.payload).toContain('height adjustable perches at equal to or more than 8cm per pullet')
    expect(response.payload).toContain('a minimum of 50% of the floor area available for litter')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the pullet housing will have these features',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullet housing will have these features')
  })

  it('user selects eligible option -> store user response and redirect to /lighting-features', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletHousingRequirements: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('lighting-features')
  })


  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletHousingRequirements: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('When the project is complete, the building must have:')
    expect(postResponse.payload).toContain('a useable area provided at multiple bird-accessible accessible heights from 10 days of age')
    expect(postResponse.payload).toContain('height adjustable perches at equal to or more than 8cm per pullet')
    expect(postResponse.payload).toContain('a minimum of 50% of the floor area available for litter')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
  })

  it('page loads with correct back link - /replacing-insulation', async () => {
    varList.projectType = 'Replacing the entire building with a new building'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"replacing-insulation\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /refurbishing-insulation', async () => {
    varList.projectType = 'Adding features to an existing building (including a mechanical ventilation system, lighting system, aviary or multi-tier system and veranda)'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"refurbishing-insulation\" class=\"govuk-back-link\">Back</a>')
  })
})
