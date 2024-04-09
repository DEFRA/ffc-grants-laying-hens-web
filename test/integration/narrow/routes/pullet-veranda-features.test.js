const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /pullet-veranda-features', () => {
  let varList = {}
  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-veranda-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have a veranda with these features?')
    expect(response.payload).toContain('If you add a veranda to your building, it must:')
    expect(response.payload).toContain('be at least 4 metres wide along the length of the pullet housing area, or equal to at least 30% of the indoor pullet housing area footprint')
    expect(response.payload).toContain('have a dimmable LED lighting system between 0 lux and 60 lux')
    expect(response.payload).toContain('have a solid concrete floor and waterproof insulated roof')
    expect(response.payload).toContain('have a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access')
    expect(response.payload).toContain('have closable pop holes in the perimeter wall, unless the veranda forms part of an indoor barn system')
    expect(response.payload).toContain('have internal access along the length of the wall of the pullet house through closable pop holes that are at least 35cm high and 40cm wide')
    expect(response.payload).toContain('have a total of 2 metres of pop hole openings along the length of the pullet house for every 1,000 pullets in the building')
    expect(response.payload).toContain('have all pop holes less than 10cm from the floor level and have access ramps as wide as the pop holes that are higher than 10cm from the floor level')
    expect(response.payload).toContain('not have perches in front of the pop holes')
    expect(response.payload).toContain('have a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.pulletVerandaFeatures = {
      error: 'Select yes if the building will have a veranda with these features',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-veranda-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have a veranda with these features')
  })

  it('user selects eligible option -> store user response and redirect to /renewable-energy', async () => {
    valList.pulletVerandaFeatures = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-veranda-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletVerandaFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('renewable-energy')
  })

  it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/pullet-veranda-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pollution-mitigation\" class=\"govuk-back-link\">Back</a>' )
    })
})
