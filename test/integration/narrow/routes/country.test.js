const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /country', () => {
  const varList = {
    legalStatus: 'randomData'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/country`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is the planned project in England?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.inEngland = {
      error: 'Select yes if the planned project is in England',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { inEngland: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the planned project is in England')
  })

  it('user selects ineligible option: \'No\' -> display ineligible page', async () => {
    valList.inEngland.error = 'You cannot apply for a grant from this scheme'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { inEngland: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /project-started', async () => {
    valList.inEngland = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { inEngland: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planning-permission')
  })
})