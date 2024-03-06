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
    expect(response.payload).toContain('Will the pullet housing have a veranda with these features?')
    expect(response.payload).toContain('The veranda must:')
    expect(response.payload).toContain('be 4 metres wide or more along the length of the bird housing area, or 30% or more of the size of the indoor bird housing area footprint')
    expect(response.payload).toContain('have a solid concrete floor and waterproof insulated roof')
    expect(response.payload).toContain('have a perimeter wall of more than one metre in height')
    expect(response.payload).toContain('have a dimmable LED lighting system with a range between 0 lux and 60 lux')
    expect(response.payload).toContain('have a mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended to make the housing biosecure during housing orders')
    expect(response.payload).toContain('have closable pop holes in the wall of the main house (unless the veranda forms part of an indoor barn system) that are less than 30cm from the floor level, or access ramps across the entire pop hole')
    expect(response.payload).toContain('not have perches in front of the pop holes')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.pulletVerandaFeatures = {
      error: 'Select yes if the pullet housing will have a veranda with these features',
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
    expect(postResponse.payload).toContain('Select yes if the pullet housing will have a veranda with these features')
  })

  it('user selects eligible option -> store user response and redirect to /dark-brooders', async () => {
    valList.pulletVerandaFeatures = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-veranda-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletVerandaFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('dark-brooders')
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
