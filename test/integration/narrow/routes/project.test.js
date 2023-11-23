const { crumbToken } = require('./test-helper')

describe('Page: /project', () => {
  const varList = {
    legalStatus: 'randomData',
    projectType: 'fakeData',
    tenancy: 'Yes',
    tenancyLength: null
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is your project?')
    expect(response.payload).toContain('Upgrade existing buildings to house calves')
    expect(response.payload).toContain('Something else')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the option that applies to you')
  })

  it('user selects ineligible option: \'Something else\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { project: 'Something else', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /minimum-floor-area', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { project: 'Building new calf housing', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('minimum-floor-area')
  })

  it('page loads with correct back link when tenancy-length page`s answer is Yes', async () => {
    varList.tenancy = 'No'
    varList.tenancyLength = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"tenancy-length\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when tenancy-length page`s answer is No', async () => {
    varList.tenancy = 'No'
    varList.tenancyLength = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"tenancy-length-condition\" class=\"govuk-back-link\">Back</a>')
  })
})
