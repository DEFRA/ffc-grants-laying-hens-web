const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /tier-number', () => {
  let varList = {
    poultryType: 'hen',
  }

  let valList = {}
  const utilsList = {
    'poultry-type-A1': 'hen',
    'poultry-type-A2': 'pullet'
  }  
  
  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - hen', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tier-number`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How many tiers will be positioned directly above each other in the aviary system?')
    expect(response.payload).toContain('The floor and the perches at the top of the aviary system are not counted as tiers')
    expect(response.payload).toContain('3 tiers or fewer')
    expect(response.payload).toContain('4 tiers or more')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tier-number`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How many tiers will be positioned directly above each other in the multi-tier system?')
    expect(response.payload).toContain('The floor and the perches at the top of the multi-tier system are not counted as tiers')
    expect(response.payload).toContain('3 tiers or fewer')
    expect(response.payload).toContain('4 tiers or more')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    valList['NOT_EMPTY'] = {
      error: 'Select how many tiers will be positioned directly above each other in the aviary system',
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
    expect(postResponse.payload).toContain('Select how many tiers will be positioned directly above each other in the aviary system')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
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
  })

  it('user selects eligible option -> store user response and redirect to /hen-multi-tier', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tier-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tierNumber: '3 tiers or fewer',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-multi-tier')
  })

  it('user selects eligible option -> store user response and redirect to /pullet-multi-tier', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tier-number`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tierNumber: '3 tiers or fewer',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-multi-tier')
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
