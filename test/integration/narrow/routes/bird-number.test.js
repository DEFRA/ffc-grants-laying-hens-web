const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

const utilsList = {
  'project-type-A2': 'Refurbishing an existing laying hen or pullet building',
  'poultry-type-A3': 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features'
}

describe('Page: /bird-number', () => {
  let varList = {
    projectType: 'Refurbishing an existing laying hen or pullet building',
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - refurbishing', async () => {
    varList.projectType = 'Refurbishing an existing laying hen or pullet building'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/bird-number`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How many birds will the refurbished part of this building be able to house?')
  })

  it('page loads successfully, with all the options - replacing', async () => {
    varList.projectType = 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/bird-number`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How many birds will this new building be able to house?')
  })

  it('no option selected -> show error message - refurbishing', async () => {
    varList.projectType = 'Refurbishing an existing laying hen or pullet building'
    valList.birdNumber = {
      error: 'Enter how many birds the refurbished part of this building will be able to house',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/bird-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many birds the refurbished part of this building will be able to house')
  })

  it('no option selected -> show error message - replacing', async () => {
    valList.birdNumber = {
      error: 'Enter how many birds this new building will be able to house',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/bird-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many birds this new building will be able to house')
  })

  it('user selects eligible option -> store user response and redirect to /solar-PV-cost', async () => {
    valList.birdNumber = false
    varList.projectType = 'Refurbishing an existing laying hen or pullet building'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/bird-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: '600',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-PV-cost')
  })

  it('page loads with correct back link - /project-cost', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/bird-number`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-cost\" class=\"govuk-back-link\">Back</a>')
  })
})
