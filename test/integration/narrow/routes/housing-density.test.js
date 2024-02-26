const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /housing-density', () => {
  let varList = {}
  
  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/housing-density`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullets be housed at a maximum stocking density of 20kg per metres squared (m²) of the total usable area at 16 weeks of age?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/housing-density`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullets will be housed at a maximum stocking density')
  })

  it('user selects eligible option -> store user response and redirect to /pullet-housing-requirements', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/housing-density`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { housingDensity: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-housing-requirements')
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
    expect(postResponse.payload).toContain('The maximum stocking density for multi-tier pullet housing at the age of 16 weeks is:')
    expect(postResponse.payload).toContain('20kg per m² of the total usable area')
    expect(postResponse.payload).toContain('33kg per m² of the total usable area at floor level')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /vaccination-lobby', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/housing-density`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"vaccination-lobby\" class=\"govuk-back-link\">Back</a>')
  })
})
