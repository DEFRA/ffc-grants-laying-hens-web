const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /solar-power-capacity', () => {
  let varList = {}
  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options - ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-power-capacity`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is the power capacity of the solar PV system?')
  })

  it('no option selected -> show error message  ', async () => {
    valList.solarPowerCapacity = {
      error: 'Enter the power capacity of the solar PV system',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-power-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarPowerCapacity: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the power capacity of the solar PV system')
  })

  it('should return an error message if invalid chars is entered', async () => {
    valList.solarPowerCapacity = {
      error: 'Estimated power capacity must be a number, like 10',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-power-capacity`,
      payload: { solarPowerCapacity: 'sw', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Estimated power capacity must be a number, like 10')
  })

  it('should return an error message if the number of digits typed exceed 2', async () => {
    valList.solarPowerCapacity = {
      error: 'Estimated power capacity must be a number up to 2 decimal places',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-power-capacity`,
      payload: { solarPowerCapacity: '123.222' , crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Estimated power capacity must be a number up to 2 decimal places')
  })

  it('user selects eligible option -> store user response and redirect to /potential-amount-solar', async () => {
    valList.solarPowerCapacity = false

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-power-capacity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarPowerCapacity: '600',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('potential-amount-solar')
  })

  it('page loads with correct back link - /solar-PV-cost', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-power-capacity`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-PV-cost\" class=\"govuk-back-link\">Back</a>')
  })
})
