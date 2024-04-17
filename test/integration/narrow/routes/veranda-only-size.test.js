const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /veranda-only-size', () => {
  const varList = {}
  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-only-size`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How big will the veranda be?')
    expect(response.payload).toContain('4 metres wide along the length of the bird housing area')
    expect(response.payload).toContain('30% of the size of the indoor bird housing area footprint.')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    valList.verandaOnlySize = {
      error: 'Select how big the veranda will be',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-only-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaOnlySize: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how big the veranda will be')
  })

  it('user selects eligible option -> store user response and redirect to /veranda-features', async () => {
    valList.verandaOnlySize = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-only-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaOnlySize: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-features')
  })

  it('user selects ineligible option `None of the above` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-only-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaOnlySize: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('4 metres wide along the length of the bird housing area')
    expect(postResponse.payload).toContain('30% of the size of the indoor bird housing area footprint.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-only-size`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"1000-birds\" class=\"govuk-back-link\">Back</a>')
  })
})
