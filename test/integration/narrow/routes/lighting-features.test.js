const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /lighting-features', () => {
  const varList = {
    poultryType: 'pullet',
    projectType: '',
  }

  const utilsList = {
    'poultry-type-A1': 'hen',
    'poultry-type-A2': 'pullet'
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - hens', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the housing lighting system have these features?')
    expect(response.payload).toContain('The housing lighting system must have:')
    expect(response.payload).toContain('non-flicker LED light with a colour temperature between 2700 and 4000 Kelvin')
    expect(response.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(response.payload).toContain('coverage of the entire floor-litter (scratch) area')
    expect(response.payload).toContain('a simulated stepped dawn and dusk')
    expect(response.payload).toContain('an option for red light to reduce feather pecking')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullets', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the housing lighting system have these features?')
    expect(response.payload).toContain('The housing lighting system must have:')
    expect(response.payload).toContain('non-flicker LED light with a colour temperature between 2700 and 4000 Kelvin')
    expect(response.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(response.payload).toContain('coverage of the entire floor-litter (scratch) area')
    expect(response.payload).toContain('a simulated stepped dawn and dusk (unless this is already provided as part of an aviary lighting system)')
    expect(response.payload).toContain('an option for red light to reduce feather pecking')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the building lighting system will have these features',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building lighting system will have these features')
  })

  it('user selects eligible option and poultry type is Laying hens -> store user response and redirect to /aviary-welfare', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('aviary-welfare')
  })

  it('user selects eligible option `Yes` and poultry type is `Pullets` -> store user response and redirect to /multi-tier-system', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('multi-tier-system')
  })

  it('user selects ineligible option `No` -> display ineligible page - hen', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The housing lighting system must have:')
    expect(postResponse.payload).toContain('non-flicker LED light with a colour temperature between 2700 and 4000 Kelvin')
    expect(postResponse.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(postResponse.payload).toContain('coverage of the entire floor-litter (scratch) area')
    expect(postResponse.payload).toContain('a simulated stepped dawn and dusk')
    expect(postResponse.payload).toContain('an option for red light to reduce feather pecking')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('user selects ineligible option `No` -> display ineligible page - pullet', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The housing lighting system must have:')
    expect(postResponse.payload).toContain('non-flicker LED light with a colour temperature between 2700 and 4000 Kelvin')
    expect(postResponse.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(postResponse.payload).toContain('coverage of the entire floor-litter (scratch) area')
    expect(postResponse.payload).toContain('a simulated stepped dawn and dusk (unless this is already provided as part of an aviary lighting system)')
    expect(postResponse.payload).toContain('an option for red light to reduce feather pecking')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - project type is Refurbishing an existing laying hen or pullet building', async () => {
    varList.projectType = 'Refurbishing an existing laying hen or pullet building'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"refurbishing-insulation\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - project type is Replacing an existing laying hen or pullet with a new building', async () => {
    varList.projectType = 'Replacing an existing laying hen or pullet with a new building'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"replacing-insulation\" class=\"govuk-back-link\">Back</a>')
  })

})
