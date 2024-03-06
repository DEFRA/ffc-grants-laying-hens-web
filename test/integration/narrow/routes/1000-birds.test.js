const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

const utilsList = {
  'poultry-type-A1': 'hen',
  'poultry-type-A2': 'pullet'
}

describe('Page: /1000-birds', () => {
  let varList = {
    poultryType: 'hen',
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, utilsList, valList)
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/1000-birds`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Do you keep at least 1,000 laying hens on your farm currently?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })
  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if you currently keep at least 1,000 laying hens on your farm',
      href: '',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you currently keep at least 1,000 laying hens on your farm')
  })
  it('user selects ineligible option `No` -> display ineligible page', async () => {
    valList = {}

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('You must keep at least 1,000 laying hens on your farm currently.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })
  it('user selects eligible option -> store user response and redirect to /building-items', async () => {
    valList.birdNumber = false

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('building-items')
  })

  it('page loads with correct back link - /poultry-type', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/1000-birds`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"poultry-type\" class=\"govuk-back-link\">Back</a>')
  })
})
