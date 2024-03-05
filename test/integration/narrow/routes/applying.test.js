const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /applying', () => {
  const varList = { businessDetails: 'randomData' }

  let valList = {}

  commonFunctionsMock(varList, 'Error', {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applying`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Who is applying for this grant?')
    expect(response.payload).toContain('Applicant')
    expect(response.payload).toContain('Agent')
  })

  it('no option selected -> show error message', async () => {
    valList.applying = {
      error: 'Select who is applying for this grant',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select who is applying for this grant')
  })

  it('user selects \'Applicant\' -> store user response and redirect to /applicant-details', async () => {
    valList.applying = null
    expect.assertions(2)
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: 'Applicant', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applicant-details')
  })

  it('user selects \'Agent\' -> store user response and redirect to /agent-details', async () => {
    expect.assertions(2)
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: 'Agent', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agent-details')
  })
})
