const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /tier-number', () => {
  const varList = {}
  const valList = {}
  const utilsList = {}  
  const NON_HENS = 'Pullets'
  
  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - Hens', async () => {
    varList.poultryType = 'Hens'
    utilsList['poultry-type-A1'] = 'Hens'
    utilsList['poultry-type-A2'] = 'Pullets'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tier-number`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How many tiers will be positioned directly above each other in the aviary system?')
    expect(response.payload).toContain('The floor and the perches at the top of the aviary system are not counted as tiers')
    expect(response.payload).toContain('3 tiers or fewer')
    expect(response.payload).toContain('4 tiers')
    delete varList.poultryType
    delete utilsList['poultry-type-A1']
    delete utilsList['poultry-type-A2']
  })

  it('page loads successfully, with all the options - Pullets', async () => {
    varList.poultryType = NON_HENS
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tier-number`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How many tiers will be positioned directly above each other in the multi-tier system?')
    expect(response.payload).toContain('The floor and the perches at the top of the multi-tier system are not counted as tiers')
    expect(response.payload).toContain('3 tiers or fewer')
    expect(response.payload).toContain('4 tiers')
    delete varList.poultryType
  })

  it('no option selected -> show error message - Hens', async () => {
    varList.poultryType = 'Hens'
    valList.NOT_EMPTY = {
      error: 'Select how many tiers will be positioned directly above each other in the aviary system',
      return: false
    }
    utilsList['poultry-type-A1'] = 'Hens'
    utilsList['poultry-type-A2'] = 'Pullets'
    
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tier-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how many tiers will be positioned directly above each other in the aviary system')
    delete varList.poultryType
    delete valList.NON_EMPTY
    delete utilsList['poultry-type-A1']
    delete utilsList['poultry-type-A2']
  })

  it('no option selected -> show error message - Pullets', async () => {
    varList.poultryType = NON_HENS
    valList['NOT_EMPTY'] = {
      error: 'Select how many tiers will be positioned directly above each other in the multi-tier system',
      return: false
    }
    
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tier-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how many tiers will be positioned directly above each other in the multi-tier system')
    delete varList.poultryType
    delete valList.NON_EMPTY
  })

  it('user selects eligible option -> store user response and redirect to /hen-multi-tier', async () => {
    varList.poultryType = 'Hens'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tier-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tierNumber: '3 tiers or fewer',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-multi-tier')
    delete varList.poultryType
  })

  it('user selects eligible option -> store user response and redirect to /pullet-multi-tier', async () => {
    varList.poultryType = NON_HENS
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tier-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tierNumber: '3 tiers or fewer',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-multi-tier')
    delete varList.poultryType
  })

  it('page loads with correct back link - /maximum-tier-height', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tier-number`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"maximum-tier-height\" class=\"govuk-back-link\">Back</a>')
  })
})
