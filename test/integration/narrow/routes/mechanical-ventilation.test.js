const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /mechanical-ventilation', () => {
  const varList = {
    poultryType: 'hen',
    projectType: 'Replacing an existing laying hen or pullet with a new building'
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
    expect(response.payload).toContain('Will the hen housing have a mechanical ventilation system with these features?')
    expect(response.payload).toContain('a control system to automatically measure and record the daily temperature, humidity, and CO₂ levels')
    expect(response.payload).toContain('an alarm system (that detects excessive high or low temperatures and system failures) with a power supply independent of mains electricity')
    expect(response.payload).toContain('an emergency power supply, for example a high-capacity generator, in case of electrical or other failures')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullet housing have a mechanical ventilation system with these features?')
    expect(response.payload).toContain('a control system to automatically measure and record the daily temperature, humidity, and CO₂ levels')
    expect(response.payload).toContain('an alarm system (that detects excessive high or low temperatures and system failures) with a power supply independent of mains electricity')
    expect(response.payload).toContain('an emergency power supply, for example a high-capacity generator, in case of electrical or other failures')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    valList.mechanicalVentilation = {
      error: 'Select yes if the hen housing will have a mechanical ventilation system with these features',
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
    expect(postResponse.payload).toContain('Select yes if the hen housing will have a mechanical ventilation system with these features')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the pullet housing will have a mechanical ventilation system with these features',
      return: false
    }    
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullet housing will have a mechanical ventilation system with these features')
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

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { mechanicalVentilation: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The ventilation must have:')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })
  it('page loads with correct back link - pullet / Rearing aviary journey', async () => {
    varList.poultryType = 'pullet'
    varList.multiTierSystem = 'Rearing aviary'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="rearing-aviary-system" class="govuk-back-link">Back</a>')
  })

  it('page loads with correct back link - pullet / Rearing aviary journey', async () => {
    varList.poultryType = 'pullet'
    varList.multiTierSystem = 'Step-up system'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/mechanical-ventilation`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="step-up-system" class="govuk-back-link">Back</a>')
  })
})
