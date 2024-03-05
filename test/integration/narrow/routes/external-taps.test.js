const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /external-taps', () => {
  let varList = {
    poultryType: 'hen',
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options - hen', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/external-taps`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the hen housing have an external tap at each main pedestrian access point?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/external-taps`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullet housing have an external tap at each main pedestrian access point?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the hen housing will have an external tap at each main pedestrian access point',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/external-taps`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the hen housing will have an external tap at each main pedestrian access point')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
    valList['NOT_EMPTY'].error = 'Select yes if the pullet housing will have an external tap at each main pedestrian access point'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/external-taps`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullet housing will have an external tap at each main pedestrian access point')
  })

  it('user selects eligible option -> store user response and redirect to /roof-solar-PV', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/external-taps`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { externalTaps: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('roof-solar-PV')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/external-taps`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { externalTaps: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('There must be an external tap to manage external footbaths at every pedestrian access point to the housing.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /soiled-water-drainage', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/external-taps`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"soiled-water-drainage\" class=\"govuk-back-link\">Back</a>')
  })
})
