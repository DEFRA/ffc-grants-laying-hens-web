const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /mechanical-ventilation', () => {
  const varList = {
    poultryType: 'hen'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options - hen', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have a mechanical ventilation system with these features?')
    expect(response.payload).toContain('a control system to automatically measure and record the daily temperature, humidity, and CO₂ levels')
    expect(response.payload).toContain('an alarm system (that detects excessive high or low temperatures and system failures) with a power supply independent of mains electricity')
    expect(response.payload).toContain('an emergency power supply, for example a high-capacity generator, in case of electrical or other failures')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })
  it('no option selected -> show error message - hen', async () => {
    valList.mechanicalVentilation = {
      error: 'Select yes if the building will have a mechanical ventilation system with these features',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { mechanicalVentilation: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have a mechanical ventilation system with these features')
  })

  it('user selects eligible option -> store user response and redirect to /hen-ventilation-specification', async () => {
    valList.mechanicalVentilation = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { mechanicalVentilation: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('hen-ventilation-specification')
  })

  it('user selects eligible option -> store user response and redirect to /pullet-ventilation-specification', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { mechanicalVentilation: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('pullet-ventilation-specification')
  })
  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { mechanicalVentilation: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The mechanical ventilation system must have:')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
  })
  it('page loads with correct back link - hen / Rearing aviary journey', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="aviary-system" class="govuk-back-link">Back</a>')
  })
  it('page loads with correct back link - pullet / Rearing aviary journey', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="housing-density" class="govuk-back-link">Back</a>')
  })
})
