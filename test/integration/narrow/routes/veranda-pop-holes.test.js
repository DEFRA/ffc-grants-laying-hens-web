const { crumbToken } = require('./test-helper')

describe('Page: /veranda-pop-holes', () => {
  const varList = {
    poultryType: 'hen'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options - hen', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-pop-holes`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the internal hen housing have lockable pop holes for the hens to enter the veranda through?')
    expect(response.payload).toContain('You must not put perches in front of the pop holes')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-pop-holes`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the internal pullet housing have lockable pop holes for the hens to enter the veranda through?')
    expect(response.payload).toContain('You must not put perches in front of the pop holes')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-pop-holes`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the internal hen housing will have lockable pop holes')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-pop-holes`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the internal pullet housing will have lockable pop holes')
  })

  it('user selects eligible option -> store user response and redirect to /veranda-project-cost', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-pop-holes`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaPopHoles: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-project-cost')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-pop-holes`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaPopHoles: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('Pop holes must:')
    expect(postResponse.payload).toContain('be at least 35cm high and 40cm wide')
    expect(postResponse.payload).toContain('extend along the entire length of the building')
    expect(postResponse.payload).toContain('The pop hole openings must add up to a total of 2 metres for every 1,000 hens.')
    expect(postResponse.payload).toContain('The base of all pop holes must either be less than 30cm from floor level, or have access ramps that are as wide as the pop holes.')
    expect(postResponse.payload).toContain('You must not put perches in front of the pop holes.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-pop-holes`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"veranda-biosecurity\" class=\"govuk-back-link\">Back</a>')
  })
})
