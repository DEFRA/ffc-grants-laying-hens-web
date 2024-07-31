const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /renewable-energy', () => {
  const varList = {}
  const utilList = {}
  const valList = {}
  const NON_HENS = 'Pullets'

  commonFunctionsMock(varList, undefined, utilList, valList)

  it('page loads successfully, with all the options - Hens', async () => {
    varList.poultryType = 'Hens'
    utilList['poultry-type-A1'] = 'Hens'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/renewable-energy`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the hen housing use renewable energy sources?')
    expect(response.payload).toContain('Solar PV system')
    expect(response.payload).toContain('A heat exchanger (heating only)')
    expect(response.payload).toContain('A heat exchanger (heating and cooling)')
    expect(response.payload).toContain('Biomass boiler')
    expect(response.payload).toContain('None of the above')
    delete varList.poultryType
    delete utilList['poultry-type-A1']
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = NON_HENS
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/renewable-energy`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullet housing use renewable energy sources?')
    expect(response.payload).toContain('Solar PV system')
    expect(response.payload).toContain('A heat exchanger (heating only)')
    expect(response.payload).toContain('A heat exchanger (heating and cooling)')
    expect(response.payload).toContain('Biomass boiler')
    expect(response.payload).toContain('None of the above')
    delete varList.poultryType
  })

  it('no option selected -> show error message', async () => {
    valList.renewableEnergy = {
      error: 'Select if the hen housing will use renewable energy sources',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/renewable-energy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { renewableEnergy: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if the hen housing will use renewable energy sources')
    delete valList.renewableEnergy
  })

  it('if you select \'A heat exchanger (heating only)\' and  \'A heat exchanger (heating and cooling)\'-> show error message ', async () => {
    valList.renewableEnergy = { 
      error: 'Select one type of heat exchanger',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/renewable-energy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { renewableEnergy: ['A heat exchanger (heating only)', 'A heat exchanger (heating and cooling)'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one type of heat exchanger')
    delete valList.renewableEnergy
  })

  it('user selects eligible option -> store user response and redirect to /bird-data-type', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/renewable-energy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { renewableEnergy: 'Solar PV system', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('bird-data-type')
  })

  it('page loads with correct back link when poultry type is hen', async () => {
    varList.poultryType = 'Hens'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/renewable-energy`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pollution-mitigation\" class=\"govuk-back-link\">Back</a>')
    delete varList.poultryType
  })

  it('page loads with correct back link when poultry type is pullet', async () => {
    varList.poultryType = NON_HENS
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/renewable-energy`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-veranda-features\" class=\"govuk-back-link\">Back</a>')
    delete varList.poultryType
  })
})
