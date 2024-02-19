const { crumbToken } = require('./test-helper')

describe('Page: /hen-veranda-features', () => {
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
      url: `${global.__URLPREFIX__}/hen-veranda-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the veranda have these features?')
    expect(response.payload).toContain('The veranda of the housing must have:')
    expect(response.payload).toContain('a solid concrete floor')
    expect(response.payload).toContain('a waterproof insulated roof')
    expect(response.payload).toContain('guttering and a down-pipe to feed into the drainage system of the main building')
    expect(response.payload).toContain('a perimeter wall at least 1 metre high')
    expect(response.payload).toContain('lockable pop holes within the perimeter wall, unless the veranda forms part of an indoor barn system')
    expect(response.payload).toContain('mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended')
    expect(response.payload).toContain('a dimmable LED lighting system between 0 lux and 60 lux')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
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

  it('user selects eligible option -> store user response and redirect to /hen-veranda-biosecurity', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-veranda-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henVerandaFeatures: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-veranda-biosecurity')
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
    expect(postResponse.payload).toContain('The veranda of the housing must have:')
    expect(postResponse.payload).toContain('a solid concrete floor')
    expect(postResponse.payload).toContain('a waterproof insulated roof')
    expect(postResponse.payload).toContain('guttering and a down-pipe to feed into the drainage system of the main building')
    expect(postResponse.payload).toContain('a perimeter wall at least 1 metre high')
    expect(postResponse.payload).toContain('lockable pop holes in the perimeter wall, unless the veranda forms part of an indoor barn system')
    expect(postResponse.payload).toContain('mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended')
    expect(postResponse.payload).toContain('a dimmable LED lighting system between 0 lux and 60 lux')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
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
