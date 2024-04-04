const { crumbToken } = require('./test-helper')
const { commonFunctionsMock } = require('../../../session-mock')

const utilsList = {
  'poultry-type-A1': 'hen',
  'project-type-A2': 'Refurbishing the existing building',
  'project-type-A3': 'Replacing the entire building with a new building',
}

describe('Page: /building-items', () => {
  const varList = {
    poultryType: 'hen',
    projectType: 'Replacing the entire building with a new building'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - hen', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/building-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have these features?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })
  it('no option selected -> show error message - hen', async () => {

    valList.buildingItems = {
      error: 'Select yes if the building will have these features',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have these features')
  })

  it('user selects eligible option and /Replacing the entire building with a new building/ at project-type page  -> store user response and redirect to /replacing-insulation', async () => {
    valList.buildingItems = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('replacing-insulation')
  })

  it('user selects eligible option and /Refurbishing the existing building/ at project-type -> store user response and redirect to /refurbishing-insulation', async () => {
    varList.projectType = 'Refurbishing the existing building'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('refurbishing-insulation')
  })

  it('user selects eligible option -> store user response and redirect to /refurbishing-insulation', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('refurbishing-insulation')
  })

  it('user selects eligible option -> store user response and redirect to /replacing-insulation', async () => {
    varList.projectType = 'Refurbishing the existing building'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('refurbishing-insulation')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('When the project is complete, the building must have:')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link when hen-veranda page is /Yes/', async () => {
    varList.henVeranda = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/building-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-veranda-features\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when hen-veranda page is /I do not have the outside space to add a veranda of this size/ ', async () => {
    varList.henVeranda = 'I do not have the outside space to add a veranda of this size'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/building-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-veranda\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when hen-veranda page is not answered ', async () => {
    varList.henVeranda = null
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/building-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"1000-birds\" class=\"govuk-back-link\">Back</a>')
  })

})
