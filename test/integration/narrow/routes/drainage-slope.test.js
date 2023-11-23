const { crumbToken } = require('./test-helper')

describe('Page: /draine-slope', () => {
  const varList = {
    legalStatus: 'randomData',
    projectType: 'fakeData',
    structure: 'A-frame building'
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
      url: `${global.__URLPREFIX__}/drainage-slope`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the floor in bedded areas slope towards a drain or drainage channel?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/drainage-slope`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the floor in bedded areas slope towards a drain or drainage channel')
  })

  it('user selects ineligible option: \'No\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/drainage-slope`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { drainageSlope: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option -> store user response and redirect to /draught-protection', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/drainage-slope`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { drainageSlope: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('draught-protection')
  })

  it('page loads with correct back link when eligible option is choosen in structure page', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/drainage-slope`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"structure\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when conditional is choosen in structure page', async () => {
    varList.structure = 'Other'
    varList.structureEligibility = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/drainage-slope`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"structure-eligibility\" class=\"govuk-back-link\">Back</a>')
  })
})
