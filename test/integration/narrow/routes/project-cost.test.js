const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

const utilsList = {
  'project-type-A2': 'Refurbishing an existing laying hen or pullet building',
  'project-type-A3': 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features',
  
}

describe('Project cost page', () => {
  let varList = {
    projectType: 'Refurbishing an existing laying hen or pullet building'
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, utilsList, valList)
  
  it('should load page successfully - project type is refurbishing', async () => {

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is the total estimated cost of refurbishing this building?')
    expect(response.payload).toContain('You can only apply for a grant of up to 40% of the estimated costs of refurbishing this building.')
    expect(response.payload).toContain('I am replacing or refurbishing multiple buildings')
    expect(response.payload).toContain('Enter the costs of refurbishing this building only.')
    expect(response.payload).toContain('You must submit a separate application for each building.')
    expect(response.payload).toContain('Do not include VAT')
    expect(response.payload).toContain('Enter amount, for example 95,000')
  })

  it('should load page successfully - project type is replacing', async () => {
    varList.projectType = 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is the total estimated cost of replacing this building?')
    expect(response.payload).toContain('You can only apply for a grant of up to 40% of the estimated costs of replacing this building.')
    expect(response.payload).toContain('I am replacing or refurbishing multiple buildings')
    expect(response.payload).toContain('Enter the costs of replacing this building only.')
    expect(response.payload).toContain('You must submit a separate application for each building.')
    expect(response.payload).toContain('Do not include VAT')
    expect(response.payload).toContain('Enter amount, for example 95,000')
  })

  it('should return an error message if number contains a space', async () => {
     valList.projectCost = {
      error: 'Enter a whole number with a maximum of 7 digits',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234 6', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if number contains a comma "," ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '123,456', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if a fraction is typed in - it contains a dot "." ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '123.456', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if the number of digits typed exceed 7', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '12345678', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if no value entered', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Enter the total estimated cost of replacing the building',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the total estimated cost of replacing the building')
  })

  it('should eliminate user if the cost entered is too low', async () => {
    valList.projectCost = null

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '12', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
  it('solarPVSystem = No -> store valid user input and redirect to potential-amount page', async () => {
    varList.solarPVSystem = 'No'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234567', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('potential-amount')
  })

  it('solarPVSystem = Yes -> store valid user input and redirect to bird-number page', async () => {
    varList.solarPVSystem = 'Yes'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234567', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('bird-number')
  })

  it('solarPVSystem = Yes -> page loads with correct back link', async () => {
    varList.solarPVSystem = 'Yes'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-PV-system\" class=\"govuk-back-link\">Back</a>')
  })

  it('roofSolarPVExemption = None of the above -> page loads with correct back link', async () => {
    varList.roofSolarPVExemption = 'None of the above'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"roof-support-solar-PV\" class=\"govuk-back-link\">Back</a>')
  })

  it('roofSolarPVExemption = The building is listed -> page loads with correct back link', async () => {
    varList.roofSolarPVExemption = 'The building is listed'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"roof-solar-PV-exemption\" class=\"govuk-back-link\">Back</a>')
  })
})
