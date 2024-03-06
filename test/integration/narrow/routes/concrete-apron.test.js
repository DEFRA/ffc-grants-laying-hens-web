const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /concrete-apron', () => {
  let varList = {
    poultryType: '',
    henVeranda: ''
  }
  
  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options - hen', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the hen housing have a continuous concrete apron around its perimeter?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullet housing have a continuous concrete apron around its perimeter?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/concrete-apron`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the hen housing will have a continuous concrete apron')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/concrete-apron`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullet housing will have a continuous concrete apron')
  })

  it('user selects eligible option -> store user response and redirect to /vehicle-washing', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/concrete-apron`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { concreteApron: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('vehicle-washing')
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
    expect(postResponse.payload).toContain('The housing and any barn system veranda areas must be surrounded by a continuous concrete apron (a hardstanding concrete area).')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /lighting-features', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"lighting-features\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /hen-pop-holes', async () => {
    varList.poultryType = 'hen'
    varList.henVeranda = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-pop-holes\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /hen-veranda', async () => {
    varList.poultryType = 'hen'
    varList.henVeranda = 'My project is exempt'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/concrete-apron`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-veranda\" class=\"govuk-back-link\">Back</a>')
  })
})
