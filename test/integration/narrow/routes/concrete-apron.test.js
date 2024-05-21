const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /concrete-apron', () => {
  let varList = {
    poultryType: '',
    henVeranda: ''
  }
  
  let valList = {}
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the structure be surrounded by a concrete apron?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })
  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the structure will be surrounded by a concrete apron',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/concrete-apron`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the structure will be surrounded by a concrete apron')
  })

  it('user selects eligible option -> store user response and redirect to /egg-store-access', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/concrete-apron`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { concreteApron: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('egg-store-access')
  })
  it('user selects eligible option -> store user response and redirect to /changing-area', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/concrete-apron`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { concreteApron: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('changing-area')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/concrete-apron`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { concreteApron: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The building (and veranda if there is one) must be surrounded by a concrete apron.')
    expect(postResponse.payload).toContain('This should be continuous, unless there needs to be a gap where birds have direct access to a range.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
  })

  it('page loads with correct back link - /pullet-ventilation-specification', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-ventilation-specification\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /hen-ventilation-specifications', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-ventilation-specification\" class=\"govuk-back-link\">Back</a>')
  })
})
