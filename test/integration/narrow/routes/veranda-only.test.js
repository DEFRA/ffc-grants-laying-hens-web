const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /veranda-only', () => {
  const varList = {}
  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-only`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the veranda be at least the same size as 30% of the indoor bird housing area footprint?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.verandaOnly = {
      error: 'Select yes if the veranda will be at least the same size as 30% of the indoor bird housing area footprint',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-only`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaOnly: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the veranda will be at least the same size as 30% of the indoor bird housing area footprint')
  })

  it('user selects eligible option -> store user response and redirect to /veranda-features', async () => {
    valList.verandaOnly = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-only`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaOnly: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-features')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-only`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaOnly: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The veranda must be at least the same size as 30% of the indoor bird housing area footprint in size.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-only`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"poultry-type\" class=\"govuk-back-link\">Back</a>')
  })
})
