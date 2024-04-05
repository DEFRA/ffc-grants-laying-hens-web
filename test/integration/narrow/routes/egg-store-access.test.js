const { crumbToken } = require('./test-helper')
const { commonFunctionsMock } = require('../../../session-mock')

describe('Page: /egg-store-access', () => {
  const varList = {
    henVeranda: 'Yes'
  }  
  let valList = {}
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/egg-store-access`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will there be direct external access to the building’s egg store?')
    expect(response.payload).toContain('This must be separate from the main entrance lobby and connected changing area')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if there will be direct external access to the building’s to egg store',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/egg-store-access`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if there will be direct external access to the building’s to egg store')
  })

  it('user selects eligible option -> store user response and redirect to /changing-area', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/egg-store-access`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { eggStoreAccess: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('changing-area')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/egg-store-access`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { eggStoreAccess: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain(`You must be able to remove eggs and deliver empty egg trays to and from the hen housing's egg store without going into the entrance lobby or connected changing area.`)
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/egg-store-access`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"concrete-apron\" class=\"govuk-back-link\">Back</a>')
  })

})
