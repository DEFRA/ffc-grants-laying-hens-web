const { crumbToken } = require('./test-helper')

describe('Page: /aviary-welfare', () => {
  const varList = {
    poultryType: '',
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
      url: `${global.__URLPREFIX__}/aviary-welfare`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the aviary system meet the manufacture&#39;s recommendation for high welfare?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-welfare`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if the aviary system will meet the recommendation for high welfare')
  })

  it('user selects eligible option -> store user response and redirect to /manure-removal', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-welfare`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviaryWelfare: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('manure-removal')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-welfare`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviaryWelfare: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The aviary system must either:')
    expect(postResponse.payload).toContain('have welfare ramps and platforms in positions that meet the manufacturer\'s recommendation for a high welfare system')
    expect(postResponse.payload).toContain('be designed for hens to move between levels without ramps and platforms.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/aviary-welfare`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"aviary-system\" class=\"govuk-back-link\">Back</a>')
  })

})
