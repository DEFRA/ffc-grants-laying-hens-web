const { crumbToken } = require('./test-helper')

describe('Page: /tenancy', () => {
  const varList = {
    tenancy: 'randomData'
  }

  jest.mock('ffc-grants-common-functionality', () => ({
    session: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return undefined
      }
    },
    regex: {
      PROJECT_COST_REGEX: /^[1-9]\d*$/
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tenancy`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is the planned project on land the business owns?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancy: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the planned project is on land the business owns')
  })

  it('user selects \'Yes\' -> store user response and redirect to /poultry-type', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancy: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('poultry-type')
  })

  it('user selects \'No\' -> store user response and redirect to /project-responsibility', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancy: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-responsibility')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tenancy`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-started\" class=\"govuk-back-link\">Back</a>')
  })
})
