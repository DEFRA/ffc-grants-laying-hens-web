const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /hen-veranda-features', () => {
  let varList = {}

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-veranda-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the veranda have these features?')
    expect(response.payload).toContain('The veranda must have:')
    expect(response.payload).toContain('a solid concrete floor')
    expect(response.payload).toContain('a waterproof insulated roof')
    expect(response.payload).toContain('a dimmable LED lighting system between 0 lux and 60 lux')
    expect(response.payload).toContain('a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access')
    expect(response.payload).toContain('closable pop holes in the perimeter wall, unless the veranda is part of an indoor barn system')
    expect(response.payload).toContain('internal access along the length of the wall of the hen house through closable pop holes that are at least 35cm high and 40cm wide')
    expect(response.payload).toContain('a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the veranda will have these features',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the veranda will have these features')
  })

  it('user selects eligible option -> store user response and redirect to /building-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVerandaFeatures: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('building-items')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVerandaFeatures: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The veranda must have:')
    expect(postResponse.payload).toContain('a solid concrete floor')
    expect(postResponse.payload).toContain('a waterproof insulated roof')
    expect(postResponse.payload).toContain('a dimmable LED lighting system between 0 lux and 60 lux')
    expect(postResponse.payload).toContain('a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access')
    expect(postResponse.payload).toContain('closable pop holes in the perimeter wall, unless the veranda is part of an indoor barn system')
    expect(postResponse.payload).toContain('internal access along the length of the wall of the hen house through closable pop holes that are at least 35cm high and 40cm wide')
    expect(postResponse.payload).toContain('a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-veranda-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-veranda\" class=\"govuk-back-link\">Back</a>')
  })
})
