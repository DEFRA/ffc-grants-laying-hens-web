const { crumbToken } = require('./test-helper')

describe('Page: /building-items', () => {
  const varList = {
    poultryType: 'hen',
    projectType: 'Replacing existing housing'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options - hen', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/building-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have these features?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })
  it('no option selected -> show error message - hen', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have these features')
  })

  it('user selects eligible option and /Replacing existing housing/ at project-type page  -> store user response and redirect to /replacing-insulation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('replacing-insulation')
  })

  it('user selects eligible option and /Refurbishing existing housing/ at project-type -> store user response and redirect to /refurbishing-insulation', async () => {
    varList.projectType = 'Refurbishing existing housing'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('refurbishing-insulation')
  })
  it('user selects eligible option -> store user response and redirect to /capped-inlets-outlets', async () => {
    varList.projectType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-housing-requirements')
  })

  it('user selects eligible option -> store user response and redirect to /capped-inlets-outlets', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-housing-requirements')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingItems: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The building must have:')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/building-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"1000-birds\" class=\"govuk-back-link\">Back</a>')
  })

})
