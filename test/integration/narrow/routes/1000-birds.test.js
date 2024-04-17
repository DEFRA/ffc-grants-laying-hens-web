const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

const utilsList = {
  'poultry-type-A1': 'hen',
  'poultry-type-A2': 'pullet'
}

describe('Page: /1000-birds', () => {
  let varList = {
    poultryType: 'hen',
    projectType: 'Refurbishing the existing building'
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - hens', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/1000-birds`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Are you the registered keeper of at least 1,000 laying hens?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })


  it('page loads successfully, with all the options - pullets', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/1000-birds`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Are you the registered keeper of at least 1,000 pullets?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - pullets', async () => {
    valList.birdNumber = {
      error: 'Select yes if you are the registered keeper of at least 1,000 pullets',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you are the registered keeper of at least 1,000 pullets')
  })

  it('no option selected -> show error message - hens', async () => {
    valList.birdNumber = {
      error: 'Select yes if you are the registered keeper of at least 1,000 laying hens',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you are the registered keeper of at least 1,000 laying hens')
  })

  it('user selects ineligible option `No` -> display ineligible page - hens', async () => {
    valList.birdNumber = null
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('You must:')
    expect(postResponse.payload).toContain('be the registered keeper of at least 1,000 laying hens')
    expect(postResponse.payload).toContain('have housed at least 1,000 laying hens on your farm in the last 6 months.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('user selects ineligible option `No` -> display ineligible page - pullets', async () => {
    valList = {}
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('You must:')
    expect(postResponse.payload).toContain('be the registered keeper of at least 1,000 pullets')
    expect(postResponse.payload).toContain('have housed at least 1,000 pullets on your farm in the last 6 months.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('user selects eligible option -> store user response and redirect to /hen-veranda', async () => {
    valList = {}
    varList.poultryType = 'hen'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-veranda')
  })

  it('user selects eligible option -> store user response and redirect to /building-items', async () => {
    valList.birdNumber = false
    varList.poultryType = 'pullet'

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

  it('user selects eligible option and projectType is `Adding a veranda only to the existing building` -> store user response and redirect to /veranda-only-size', async () => {
    varList.projectType = 'Adding a veranda only to the existing building'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-only-size')
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
