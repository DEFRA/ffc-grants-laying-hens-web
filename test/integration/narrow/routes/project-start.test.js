const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /project-started', () => {
  const varList = { planningPermission: 'randomData', inEngland: 'yes' }
  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-started`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Have you already started work on the project?')
    expect(response.payload).toContain('Yes, preparatory work')
    expect(response.payload).toContain('Yes, we have begun project work')
    expect(response.payload).toContain('No, we have not done any work on this project yet')
  })

  it('no option selected -> show error message', async () => {
    valList.projectStart = {
      error: 'Select if you have already started work on the project',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-started`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectStart: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if you have already started work on the project')
  })

  it('user selects ineligible option: \'Yes, we have begun project work\' -> display ineligible page', async () => {
    valList.projectStart = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-started`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectStart: 'Yes, we have begun project work', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /tenancy', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-started`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectStart: 'Yes, preparatory work', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('tenancy')
  })

  it('page loads with correct back link - /planning-permission', async () => {
    varList.planningPermission = 'Not needed'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-started`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"planning-permission\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /planning-permission-condition', async () => {
    varList.planningPermission = 'Should be in place by the time I make my full application'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-started`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"planning-permission-condition\" class=\"govuk-back-link\">Back</a>')
  })
})
