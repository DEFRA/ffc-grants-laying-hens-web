const { crumbToken } = require('./test-helper')

describe('Page: /hen-veranda', () => {
  const varList = {
    poultryType: 'hen',
    projectType: 'Replacing existing housing'
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
      url: `${global.__URLPREFIX__}/hen-veranda`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the housing have a veranda that is at least the same size as 30% of the indoor bird housing area footprint?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    expect(response.payload).toContain('My project is exempt')
  })

  it('no option selected -> show error message', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if the housing will have a veranda that is at least the same size as 30% of the indoor bird housing area footprint')
  })

  it('user selects eligible option -> store user response and redirect to /hen-veranda-features', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVeranda: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-veranda-features')
  })

  it('user selects exempt option -> store user response and redirect to /concrete-apron', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVeranda: 'My project is exempt', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('concrete-apron')
  })


  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVeranda: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The housing must have a veranda that is at least the same size as 30% of the indoor bird housing area footprint in size.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-veranda`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"lighting-features\" class=\"govuk-back-link\">Back</a>')
  })
})
