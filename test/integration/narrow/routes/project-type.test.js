const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /project-type', () => {
  const varList = {
    poultryType: 'Laying hens'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What work are you doing to this building?')
    expect(response.payload).toContain('Adding a veranda only to an existing laying hen or pullet building')
    expect(response.payload).toContain('Refurbishing an existing laying hen or pullet building')
    expect(response.payload).toContain('Replacing the entire laying hen or pullet building with a new building including the grant funding required features')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select what work you are doing to this building',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what work you are doing to this building')
  })

it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects `Replacing the entire laying hen or pullet building with a new building including the grant funding required features` -> store user response and redirect to /applicant-type', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applicant-type')
  })

  it('user selects `Replacing the entire laying hen or pullet building with a new building including the grant funding required features` -> store user response and redirect to /applicant-type', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applicant-type')
  })

  it('page loads with correct back link ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"start\" class=\"govuk-back-link\">Back</a>')
  })
})
