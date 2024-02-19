const { crumbToken } = require('./test-helper')

describe('Page: /lighting-features', () => {
  const varList = {
    poultryType: 'Laying hens',
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
      url: `${global.__URLPREFIX__}/lighting-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the housing&#39;s lighting system have these features?')
    expect(response.payload).toContain('The housing lighting system must have:')
    expect(response.payload).toContain('the ability to provide an automatic stepped dawn and dusk lighting environment (unless this is already provided as part of an aviary lighting system)')
    expect(response.payload).toContain('an option for red light')
    expect(response.payload).toContain('a fail-safe standby device in case of electrical or other failures')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the housing’s lighting system will have these features')
  })

  it('user selects eligible option and poultry type is Laying hens -> store user response and redirect to /hen-veranda', async () => {
    varList.poultryType = 'Laying hens'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-veranda')
  })

  it('user selects eligible option `Yes` and poultry type is `Pullets` -> store user response and redirect to /concrete-apron', async () => {
    varList.poultryType = 'Pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('concrete-apron')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The housing lighting system must have:')
    expect(postResponse.payload).toContain('the ability to provide an automatic stepped dawn and dusk lighting environment (unless this is already provided as part of an aviary lighting system)')
    expect(postResponse.payload).toContain('an option for red light')
    expect(postResponse.payload).toContain('a fail-safe standby device in case of electrical or other failure')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    varList.poultryType = 'Laying Hens'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"lighting-system\" class=\"govuk-back-link\">Back</a>')
  })

})
