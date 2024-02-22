const { crumbToken } = require('./test-helper')

describe('Page: /natural-light', () => {
  let varList = {
    poultryType: 'hen',
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
      url: `${global.__URLPREFIX__}/natural-light`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have windows that provide natural light to the indoor housing?')
    expect(response.payload).toContain('The windows must be:')
    expect(response.payload).toContain('fitted with an insulated blind to manage light intensity and housing temperature')
    expect(response.payload).toContain('equal to at least 3% of size of the bird space footprint')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/natural-light`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have windows that provide natural light to the indoor housing')
  })

  it('user selects eligible option -> store user response and redirect to easy-grip-perches', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/natural-light`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { naturalLight: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('easy-grip-perches')
  })

  it('page loads with correct back link - /hen-multi-tier', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/natural-light`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-multi-tier\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /pullet-multi-tier', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/natural-light`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-multi-tier\" class=\"govuk-back-link\">Back</a>')
  })
})
