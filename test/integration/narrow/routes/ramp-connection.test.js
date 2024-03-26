const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /ramp-connection', () => {
  let varList = {
      currentSystem: 'Colony cage'
  }
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/ramp-connection`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will every level of the multi-tier system be connected to another level by a ramp?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if every level of the multi-tier system will be connected to another level by a ramp',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/ramp-connection`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if every level of the multi-tier system will be connected to another level by a ramp')
  })

  it('user selects eligible option -> store user response and redirect to /maximum-tier-height', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/ramp-connection`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { rampConnection: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('maximum-tier-height')
  })

  const testBackLink = async (option, destination) => { 
    varList.currentSystem = option
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/ramp-connection`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(`<a href=\"${destination}"\ class=\"govuk-back-link\">Back</a>`
  )}

  it('page loads with correct back link - /current-system', async () => {
    await testBackLink('Colony cage', 'current-system')
  })

  it('page loads with correct back link - /current-multi-tier-system - Combi-cage is selected', async () => {
    await testBackLink('Combi-cage', 'current-system')
  })

  it('page loads with correct back link - /current-multi-tier-system - Barn is selected', async () => {
    await testBackLink('Barn', 'current-multi-tier-system')
  })

  it('page loads with correct back link - /current-multi-tier-system - Free-range is selected', async () => {
    await testBackLink('Free-range', 'current-multi-tier-system')
  })

  it('page loads with correct back link - /current-multi-tier-system - Organic is selected' , async () => {
    await testBackLink('Organic', 'current-multi-tier-system')
  })

  it('page loads with correct back link - /current-multi-tier-system - None of the above is selected', async () => {
    await testBackLink('None of the above', 'current-multi-tier-system')
  })  
})
