const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /pollution-mitigation', () => {
  let varList = {}
  let valList = {}
  const NON_HENS = 'Pullets'

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pollution-mitigation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have any of the following?')
    expect(response.payload).toContain('Select all that apply')
    expect(response.payload).toContain('Manure drying')
    expect(response.payload).toContain('Air filtration at inlets')
    expect(response.payload).toContain('Air filtration at outlets, for example using wet or dry scrubbers')
    expect(response.payload).toContain('A tree shelter belt near air outlets')
    expect(response.payload).toContain('or')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    valList.pollutionMitigation = {
      error: 'Select if the building will have any of the following',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pollution-mitigation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if the building will have any of the following')
    delete valList.pollutionMitigation
  })

  it('user selects eligible option -> store user response and redirect to /renewable-energy - hens', async () => {
    varList.poultryType = 'Hens'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pollution-mitigation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pollutionMitigation: ['Air filtration at inlets'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('renewable-energy')
    delete varList.poultryType
  })

  it('user selects eligible option -> store user response and redirect to /pullet-veranda-features - pullets', async () => {
    varList.poultryType = NON_HENS
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pollution-mitigation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pollutionMitigation: ['Air filtration at inlets', 'Manure drying'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-veranda-features')
    delete varList.poultryType
  })

  it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/pollution-mitigation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"building-biosecurity\" class=\"govuk-back-link\">Back</a>' )
    })
})
