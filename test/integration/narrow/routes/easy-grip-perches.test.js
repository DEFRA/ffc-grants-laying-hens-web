const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /easy-grip-perches', () => {
  const varList = {}
  let valList = {}
  const NON_HENS = 'Pullets'

  const utilsList = {
    'poultry-type-A1': 'Hens',
    'poultry-type-A2': 'Pullets'
  }
  
  commonFunctionsMock(varList, undefined, utilsList, valList)

  it('page loads successfully, with all the options - hens', async () => {
    varList.poultryType = 'Hens'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the perches have a design feature that helps the birds grip?')
    expect(response.payload).toContain(`You can replace an aviary's standard circular metal perches with perches that have design features to help birds grip them (for example, an easy grip shape, a ridged surface, comfortable material or coating)`)
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    delete varList.poultryType
  })

  it('page loads successfully, with all the options - pullets', async () => {
    varList.poultryType = NON_HENS
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the perches have a design feature that helps the birds grip?')
    expect(response.payload).toContain(`You can replace a multi-tier system's standard circular metal perches with perches that have design features to help birds grip them (for example, an easy grip shape, a ridged surface, comfortable material or coating)`)
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    delete varList.poultryType
  })

  it('no option selected -> show error message - hens', async () => {
    valList.easyGripPerches = {
      error: 'Select yes if the perches will have a design feature that help the birds grip',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/easy-grip-perches`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { easyGripPerches: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the perches will have a design feature that help the birds grip')
    delete valList.easyGripPerches
  })

  it('user selects eligible option -> store user response and redirect to /building-biosecurity', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/easy-grip-perches`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { easyGripPerches: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('building-biosecurity')
  })

  it('page loads with correct back link - hens', async () => {
    varList.poultryType = 'Hens'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"natural-light\" class=\"govuk-back-link\">Back</a>')
    delete varList.poultryType
  })

  it('page loads with correct back link - pullet', async () => {
    varList.poultryType = NON_HENS
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"dark-brooders\" class=\"govuk-back-link\">Back</a>')
  })


})
