const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /roof-support-solar-PV', () => {
  let varList = {}
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/roof-support-solar-PV`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the roof of this building be able to structurally support solar PV panels?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the roof of this building will be able to structurally support solar PV panels',
      return: false
    }
    
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/roof-support-solar-PV`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the roof of this building will be able to structurally support solar PV panels')
  })

  it('user selects eligible option -> store user response and redirect to /project-cost', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/roof-support-solar-PV`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roofSupportSolarPV: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/roof-support-solar-PV`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roofSupportSolarPV: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The roof of this building must be able to support solar PV panels, allowing for potential use in the future.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
  })

  it('page loads with correct back link - /roof-solar-PV-exemption', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/roof-support-solar-PV`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"roof-solar-PV-exemption\" class=\"govuk-back-link\">Back</a>')
  })
})
