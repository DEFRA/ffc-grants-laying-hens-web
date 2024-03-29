const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /vaccination-lobby', () => {
  let varList = {}
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/vaccination-lobby`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will there be a designated vaccination lobby with internal and external access?')
    expect(response.payload).toContain('Internal access from the bird living area and external access from the loading bay')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if there will be a designated vaccination lobby',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vaccination-lobby`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if there will be a designated vaccination lobby')
  })

  it('user selects eligible option -> store user response and redirect to /changing-area', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vaccination-lobby`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { vaccinationLobby: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('changing-area')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/vaccination-lobby`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { vaccinationLobby: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The building must have a dedicated area to perform pullet vaccinations, with access to the loading bay.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/vaccination-lobby`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"concrete-apron\" class=\"govuk-back-link\">Back</a>')
  })
})
