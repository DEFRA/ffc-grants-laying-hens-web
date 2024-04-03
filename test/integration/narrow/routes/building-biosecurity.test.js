const { crumbToken } = require('./test-helper')
const { commonFunctionsMock } = require('../../../session-mock')

describe('Page: /building-biosecurity', () => {
  let varList = {}
  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/building-biosecurity`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building structure include the following?')
    expect(response.payload).toContain('Shower facilities in the biosecurity changing area')
    expect(response.payload).toContain('An integrated externally accessible storage room with a separate air space')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    valList.buildingBiosecurity = {
      error: 'Select if the building structure will include the following',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-biosecurity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingBiosecurity: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if the building structure will include the following')
  })

  it('user selects eligible option -> store user response and redirect to /pollution-mitigation', async () => {
    valList.buildingBiosecurity = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/building-biosecurity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { buildingBiosecurity: ['fake type', 'fake type2'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pollution-mitigation')
  })
  it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/building-biosecurity`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"easy-grip-perches\" class=\"govuk-back-link\">Back</a>' )
    })
})
