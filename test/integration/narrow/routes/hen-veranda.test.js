const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /hen-veranda', () => {
  const varList = {
    poultryType: 'hen',
    projectType: 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-veranda`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have a veranda that is the required size?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    expect(response.payload).toContain('I do not have the outside space to add a veranda of this size')
  })

  it('no option selected -> show error message', async () => {
    varList.poultryType = 'hen'
    valList.henVeranda = {
      error: 'Select yes if the building will have a veranda that is the required size',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have a veranda that is the required size')
  })

  it('user selects eligible option -> store user response and redirect to /hen-veranda-features', async () => {
    valList.henVeranda = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVeranda: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-veranda-features')
  })

  it('user selects last option -> store user response and redirect to /building-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVeranda: 'I do not have the outside space to add a veranda of this size', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('building-items')
  })


  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVeranda: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('You must add a veranda if you have the required space.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-veranda`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"1000-birds\" class=\"govuk-back-link\">Back</a>')
  })
})
