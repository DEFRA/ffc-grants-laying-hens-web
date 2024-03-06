const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /project-responsibility', () => {
  const varList = {
    projectSubject: 'randomData',
    tenancy: 'No'
  }

  let valList = {}

  commonFunctionsMock(varList, null, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-responsibility`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will you take full responsibility for your project?')
    expect(response.payload).toContain('Yes, I plan to take full responsibility for my project')
    expect(response.payload).toContain('No, I plan to ask my landlord to underwrite my agreement')
  })

  it('no option selected -> show error message', async () => {
    valList.projectResponsibility = {
      error: 'Select yes if you will take full responsibility for your project',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-responsibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectResponsibility: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you will take full responsibility for your project')
  })


  it('page loads with correct back link', async () => {
    valList.projectResponsibility = null
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-responsibility`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"tenancy\" class=\"govuk-back-link\">Back</a>')
  })
})
