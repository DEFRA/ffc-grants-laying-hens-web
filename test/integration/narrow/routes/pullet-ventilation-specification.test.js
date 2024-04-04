const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /pullet-ventilation-specification', () => {
  const varList = {
    poultryType: 'pullet',
    projectType: 'Replacing the entire building with a new building'
  }
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)
  
  it('page loads successfully, with all the options - hen', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-ventilation-specification`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the ventilation system be fit for purpose in extreme heat?')
    expect(response.payload).toContain('In extreme heat, the ventilation system must be able to provide:')
    expect(response.payload).toContain('an air speed of one metre per second over birds')
    expect(response.payload).toContain('a maximum ventilation rate of 9,000m³ per hour per 1000 birds')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'

    valList['NOT_EMPTY'] = {
      error: 'Select yes if the ventilation system will be fit for purpose in extreme heat',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-ventilation-specification`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the ventilation system will be fit for purpose in extreme heat')
  })

  it('user selects eligible option -> store user response and redirect to /concrete-apron', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-ventilation-specification`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletVentilationSpecification: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('concrete-apron')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-ventilation-specification`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletVentilationSpecification: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('an air speed of one metre per second over birds')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })
  it('page loads with correct back link - pullet / mechanical-ventilation', async () => {
    varList.poultryType = 'pullet'
    varList.multiTierSystem = 'Rearing aviary'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-ventilation-specification`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"mechanical-ventilation" class="govuk-back-link">Back</a>')
  })

})
