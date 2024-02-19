const { crumbToken } = require('./test-helper')

describe('Page: /manure-removal', () => {
let varList = {}

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
      url: `${global.__URLPREFIX__}/manure-removal`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the aviary system automatically remove manure?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/manure-removal`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the aviary system will automatically remove manure')
  })

  it('user selects eligible option -> store user response and redirect to /aviary-lighting-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/manure-removal`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { manureRemoval: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('aviary-lighting-system')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/manure-removal`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { manureRemoval: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The aviary system must have an integrated automatic manure-removal system to ensure good air quality.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/manure-removal`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"aviary-welfare\" class=\"govuk-back-link\">Back</a>')
  })

})
