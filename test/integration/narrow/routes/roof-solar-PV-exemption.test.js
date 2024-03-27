const { crumbToken } = require('./test-helper')
const { commonFunctionsMock } = require('../../../session-mock')

const utilsList = {
  'poultry-type-A1': 'hen',
  'project-type-A2': 'Refurbishing an existing laying hen or pullet building',
  'project-type-A3': 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features',
}

describe('Page: /roof-solar-PV-exemption', () => {
  const varList = {
    poultryType: 'hen',
    projectType: 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/roof-solar-PV-exemption`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which of these statements apply to this project?')
    expect(response.payload).toContain('The building is listed')
    expect(response.payload).toContain('The building is on a World Heritage Site')
    expect(response.payload).not.toContain('I am not making changes to this building’s roof');
    expect(response.payload).toContain('The roof only faces north')
    expect(response.payload).toContain('The roof is heavily shaded')
    expect(response.payload).toContain('The roof does not have 100m² of clear roof space')
    expect(response.payload).toContain('None of the above')

  })
  it('page loads with /I am not making changes to this building’s roof/ if project type is /Refurbishing an existing laying hen or pullet building/', async () => {
    varList.projectType = 'Refurbishing an existing laying hen or pullet building'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/roof-solar-PV-exemption`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('I am not making changes to this building’s roof');
  })

  it('no option selected -> show error message', async () => {

    valList.roofSolarPVExemption = {
      error: 'Select which of these statement apply to this project',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/roof-solar-PV-exemption`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roofSolarPVExemption: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select which of these statement apply to this project')
  })

  it('no option selected -> show error message', async () => {

    valList.roofSolarPVExemption = {
      error: 'You cannot select that combination of options',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/roof-solar-PV-exemption`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roofSolarPVExemption: ['The building is listed', 'The building is on a World Heritage Site', 'None of the above'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot select that combination of options')
  })

  it('user selects eligible option -> store user response and redirect to /project-cost', async () => {
    valList.roofSolarPVExemption = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/roof-solar-PV-exemption`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roofSolarPVExemption: ['The building is listed', 'The building is on a World Heritage Site'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('user selects /None of the above/ and redirect /roof-support-solar-PV/', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/roof-solar-PV-exemption`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roofSolarPVExemption: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('roof-support-solar-PV')
  })


  it('page loads with correct back link when hen-veranda page is not answered ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/roof-solar-PV-exemption`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-PV-system\" class=\"govuk-back-link\">Back</a>')
  })

})
