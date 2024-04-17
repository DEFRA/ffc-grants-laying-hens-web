const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /easy-grip-perches', () => {
  const varList = {
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
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the perches have a design feature that helps the birds grip?')
    expect(response.payload).toContain(`You can replace an aviary's standard circular metal perches with perches that have design features to help birds grip them (for example, an easy grip shape, a ridged surface, comfortable material or coating)`)
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
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
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
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
  })

  it('user selects eligible option -> store user response and redirect to /building-biosecurity', async () => {
    valList.easyGripPerches = null
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

  it('page loads with correct back link - hen', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"natural-light\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"dark-brooders\" class=\"govuk-back-link\">Back</a>')
  })


})
