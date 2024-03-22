const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /vehicle-washing', () => {
  let varList = {}

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/vehicle-washing`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will there be a designated area for washing and disinfecting vehicles?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.vehicleWashing = {
      error: 'Select yes if there will be a designated area for washing and disinfecting vehicles',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vehicle-washing`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { vehicleWashing: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if there will be a designated area for washing and disinfecting vehicles')
  })

  it('user selects eligible option -> store user response and redirect to /solar-PV-system', async () => {
    valList.vehicleWashing = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vehicle-washing`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { vehicleWashing: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-PV-system')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vehicle-washing`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { vehicleWashing: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('There must be a designated washing and disinfecting area on site with:')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /external-taps', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/vehicle-washing`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"external-taps\" class=\"govuk-back-link\">Back</a>')
  })
})
