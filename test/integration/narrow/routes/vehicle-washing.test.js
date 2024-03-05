const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /vehicle-washing', () => {
  let varList = {
    poultryType: ''
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options - hen', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/vehicle-washing`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the hen housing have a designated area for washing and disinfecting vehicles?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/vehicle-washing`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullet housing have a designated area for washing and disinfecting vehicles?')
    expect(response.payload).toContain('This must include an area of concrete parking which is appropriate to the size of the vehicles entering the facility (minimum width of 3 metres)')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the hen housing will have a designated area for washing and disinfecting vehicles',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vehicle-washing`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the hen housing will have a designated area for washing and disinfecting vehicles')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
    valList['NOT_EMPTY'].error = 'Select yes if the pullet housing will have a designated area for washing and disinfecting vehicles' 
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vehicle-washing`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullet housing will have a designated area for washing and disinfecting vehicles')
  })

  it('user selects eligible option -> store user response and redirect to /soiled-water-drainage', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vehicle-washing`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { vehicleWashing: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('soiled-water-drainage')
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
    expect(postResponse.payload).toContain('There must be a designated washing and disinfecting area for vehicles entering the facility.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /concrete-apron', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/vehicle-washing`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"concrete-apron\" class=\"govuk-back-link\">Back</a>')
  })
})
