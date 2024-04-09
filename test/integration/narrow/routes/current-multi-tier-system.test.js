const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /current-multi-tier-system', () => {
  const varList = {
    poultryType: 'hen',
  }

  const utilsList = {
    'poultry-type-A1': 'hen',
    'poultry-type-A2': 'pullet'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - hen', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/current-multi-tier-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does your building currently include an aviary system?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/current-multi-tier-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does your building currently include a multi-tier system?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    valList.currentMultiTierSystem = {
      error: 'Select yes if your building currently includes an aviary system',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/current-multi-tier-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if your building currently includes an aviary system')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
    valList['NOT_EMPTY'] = {
      error: 'Select yes if your building currently includes a multi-tier system',
      return: false
    }
    
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/current-multi-tier-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if your building currently includes a multi-tier system')
  })

  it('user selects eligible option -> store user response and redirect to /ramp-connection', async () => {
    valList.currentMultiTierSystem = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/current-multi-tier-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { currentMultiTierSystem: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('ramp-connection')
  })


  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/current-multi-tier-system`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"current-system\" class=\"govuk-back-link\">Back</a>')
  })
})
