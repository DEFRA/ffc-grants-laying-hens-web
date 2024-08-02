const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /replacing-insulation', () => {
  const varList = {}
  const valList = {}
  const NON_HENS = 'Pullets'

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options - Hens', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/replacing-insulation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have full wall and roof insulation?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - Hens', async () => {
    valList.NOT_EMPTY = {
      error: 'Select yes if the building will have full wall and roof insulation',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/replacing-insulation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have full wall and roof insulation')
    delete valList.NOT_EMPTY
  })

  it('user selects eligible option -> store user response and redirect to /lighting-features', async () => {
    varList.poultryType = 'Hens'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/replacing-insulation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { replacingInsulation: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('lighting-features')
    delete varList.poultryType
  })

  it('user selects eligible option -> store user response and redirect to /pullet-housing-requirements', async () => {
    varList.poultryType = NON_HENS
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/replacing-insulation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { replacingInsulation: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-housing-requirements')
    delete varList.poultryType
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/replacing-insulation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { replacingInsulation: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The new building must have wall and roof insulation with a U-Value of less than 0.3 watts per square metre, per degree Kelvin (0.3W/m²K).')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/replacing-insulation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"building-items\" class=\"govuk-back-link\">Back</a>')
  })

})
