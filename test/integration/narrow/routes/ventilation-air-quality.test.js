const { crumbToken } = require('./test-helper')

describe('Page: /ventilation-air-quality', () => {
  let varList = {
    poultryType: 'Laying Hens'
  }
  
  jest.mock('ffc-grants-common-functionality', () => ({
    session: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return undefined
      }
    },
    regex: {
      PROJECT_COST_REGEX: /^[1-9]\d*$/
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/ventilation-air-quality`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the ventilation maintain the required air quality parameters?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/ventilation-air-quality`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the ventilation will maintain the required air quality parameters')
  })

  it('user selects eligible option -> store user response and redirect to /lighting-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/ventilation-air-quality`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { ventilationAirQuality: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('lighting-system')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/ventilation-air-quality`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { ventilationAirQuality: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The ventilation must maintain air quality (at bird head height of less than 50cm) at a:')
    expect(postResponse.payload).toContain('carbon dioxide level of less than 3,000 parts per million (ppm)')
    expect(postResponse.payload).toContain('percentage relative humidity (%rH) level of 40% to 70%')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /hen-ventilation-rate - if poultry type is Laying Hens', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/ventilation-air-quality`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-ventilation-rate\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /pullet-ventilation-rate - if poultry type is Pullets', async () => {
    varList.poultryType = 'Pullets'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/ventilation-air-quality`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-ventilation-rate\" class=\"govuk-back-link\">Back</a>')
  })
})
