const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /maximum-tier-height', () => {
  let varList = {
    poultryType: 'hen',
    rampConnection: 'Yes'
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/maximum-tier-height`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the highest tier with direct access to the floor be 2 metres high or less?')
    expect(response.payload).toContain('Measured from the litter floor area to the underside of the manure belt')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the highest tier with direct access to the floor will be 2 metres high or less',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/maximum-tier-height`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the highest tier with direct access to the floor will be 2 metres high or less')
  })

  it('user selects eligible option -> store user response and redirect to /tier-number', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/maximum-tier-height`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { maximumTierHeight: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('tier-number')
  })

  it('page loads with correct back link - /ramp-connection', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/maximum-tier-height`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"ramp-connection\" class=\"govuk-back-link\">Back</a>')
  })
})
