const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /housing-density', () => {
  let varList = {
    multiTierSystem: 'Rearing aviary',
  }
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/housing-density`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullets be housed within this maximum stocking density when they are 16 weeks old?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the pullets will be housed within the maximum stocking density',
      return: false
    }
    
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/housing-density`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullets will be housed within the maximum stocking density')
  })

  it('user selects eligible option -> store user response and redirect to /mechanical-ventilation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/housing-density`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { housingDensity: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('mechanical-ventilation')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/housing-density`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { housingDensity: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('To be eligible for grant funding, the maximum stocking density for multi-tier pullet housing at the age of 16 weeks must be within:')
    expect(postResponse.payload).toContain('20kg per m² of the total usable area')
    expect(postResponse.payload).toContain('33kg per m² of the total usable area at floor level')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
  })
  it('page loads with correct back link - /rearing-aviary-system', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/housing-density`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"rearing-aviary-system\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link - /step-up-system', async () => {
    varList.poultryType = 'pullet'
    varList.multiTierSystem = 'Step-up system'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/housing-density`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"step-up-system\" class=\"govuk-back-link\">Back</a>')
  })
})
