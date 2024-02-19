const { crumbToken } = require('./test-helper')

describe('Page: /capped-inlets-outlets', () => {
  const varList = {
    projectType: '',
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

  it('page loads successfully with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/capped-inlets-outlets`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will all roof and wall inlets and outlets be capped with mesh that has a spacing of 6 millimetres (mm) or less?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })


  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capped-inlets-outlets`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { cappedInletsOutlets: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if all the roof and wall inlets and outlets will be capped')
  })

  it('user selects `Replacing existing housing` on /projectType page and eligible option `Yes` -> store user response and redirect to /replacing-insulation', async () => {
    varList.projectType = 'Replacing existing housing'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capped-inlets-outlets`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { cappedInletsOutlets: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('replacing-insulation')
  })

  it('user selects `Refurbishing existing housing` on /projectType page and eligible option `Yes` -> store user response and redirect to /refurbishing-insulation', async () => {
    varList.projectType = 'Refurbishing existing housing'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capped-inlets-outlets`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { cappedInletsOutlets: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('refurbishing-insulation')
  })


  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/capped-inlets-outlets`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { cappedInletsOutlets: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('All roof and wall inlets and outlets must be capped with mesh that has a spacing of 6 millimetres (mm) or less.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/capped-inlets-outlets`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"building-items\" class=\"govuk-back-link\">Back</a>')
  })

})
