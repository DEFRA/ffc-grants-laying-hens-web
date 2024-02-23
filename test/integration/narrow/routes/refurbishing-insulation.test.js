const { crumbToken } = require('./test-helper')

describe('Page: /refurbishing-insulation', () => {
  const varList = {
    poultryType: 'hen',
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
      url: `${global.__URLPREFIX__}/refurbishing-insulation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have full wall and roof insulation?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/refurbishing-insulation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have full wall and roof insulation')
  })
  it('user selects eligible option -> store user response and redirect to /lighting-features', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/refurbishing-insulation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { refurbishingInsulation: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('lighting-features')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/refurbishing-insulation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { refurbishingInsulation: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The housing must have full wall and roof insulation.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/refurbishing-insulation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"building-items\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when poultry-type is pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/refurbishing-insulation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-housing-requirements\" class=\"govuk-back-link\">Back</a>')
  })

})
