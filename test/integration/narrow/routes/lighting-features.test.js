const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /lighting-features', () => {
  const selectedAnswersList = {
    // poultryType: '',
    // projectType: '',
  }

  const questionBankAnswers = {
    // 'poultry-type-A1': 'Hens',
    // 'poultry-type-A2': 'Pullets',
    // 'project-type-A2': 'Refurbishing the existing building',
    // 'project-type-A3': 'Replacing the entire building with a new building'
  }

  let valList = {}
  
  commonFunctionsMock(selectedAnswersList, undefined, questionBankAnswers, valList)

  it('page loads successfully, with all the options - Hens', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the house lighting system have these features?')
    expect(response.payload).toContain('When the project is complete, the house lighting system must have:')
    expect(response.payload).toContain('non-flicker LED light with a colour temperature between 2,700 and 4,000 Kelvin')
    expect(response.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(response.payload).toContain('full coverage of the exposed floor-litter (scratch) area')
    expect(response.payload).toContain('an option for red light to reduce feather pecking')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - Pullets', async () => {
    selectedAnswersList.poultryType = 'Pullets'
    questionBankAnswers['poultry-type-A2'] = 'Pullets'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the house lighting system have these features?')
    expect(response.payload).toContain('When the project is complete, the house lighting system must have:')
    expect(response.payload).toContain('non-flicker LED light with a colour temperature between 2,700 and 4,000 Kelvin')
    expect(response.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(response.payload).toContain('full coverage of the exposed floor-litter (scratch) area')
    expect(response.payload).toContain('a simulated stepped dawn and dusk (unless this is already provided as part of a rearing aviary lighting system)')
    expect(response.payload).toContain('an option for red light to reduce feather pecking')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    delete selectedAnswersList.poultryType
    delete questionBankAnswers['poultry-type-A2']
  })

  it('no option selected -> show error message', async () => {
    valList.NOT_EMPTY = {
      error: 'Select yes if the house lighting system will have these features',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the house lighting system will have these features')
    delete valList.NOT_EMPTY
  })

  it('user selects eligible option and poultry type is Laying hens -> store user response and redirect to /aviary-welfare', async () => {
    selectedAnswersList.poultryType = 'Hens'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('aviary-welfare')
    delete selectedAnswersList.poultryType
  })

  it('user selects eligible option `Yes` and poultry type is `Pullets` -> store user response and redirect to /multi-tier-system', async () => {
    selectedAnswersList.poultryType = 'Pullets'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('multi-tier-system')
    delete selectedAnswersList.poultryType
  })

  it('user selects ineligible option `No` -> display ineligible page - Hens', async () => {
    selectedAnswersList.poultryType = 'Hens'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('When the project is complete, the house lighting system must have:')
    expect(postResponse.payload).toContain('non-flicker LED light with a colour temperature between 2,700 and 4,000 Kelvin')
    expect(postResponse.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(postResponse.payload).toContain('full coverage of the exposed floor-litter (scratch) area')
    expect(postResponse.payload).toContain('an option for red light to reduce feather pecking')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
    delete selectedAnswersList.poultryType
  })

  it('user selects ineligible option `No` -> display ineligible page - Pullets', async () => {
    selectedAnswersList.poultryType = 'Pullets'
    questionBankAnswers['poultry-type-A2'] = 'Pullets'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/lighting-features`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { lightingFeatures: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('When the project is complete, the house lighting system must have:')
    expect(postResponse.payload).toContain('non-flicker LED light with a colour temperature between 2,700 and 4,000 Kelvin')
    expect(postResponse.payload).toContain('capacity for zonal dimming between 0 and 60 lux')
    expect(postResponse.payload).toContain('full coverage of the exposed floor-litter (scratch) area')
    expect(postResponse.payload).toContain('a simulated stepped dawn and dusk (unless this is already provided as part of a rearing aviary lighting system)')
    expect(postResponse.payload).toContain('an option for red light to reduce feather pecking')
    expect(postResponse.payload).toContain('See other grants you may be eligible for')
    delete selectedAnswersList.poultryType
    delete questionBankAnswers['poultry-type-A2']
  })

  it('page loads with correct back link - /refurbishing-insulation', async () => {
    selectedAnswersList.poultryType = 'Hens'
    selectedAnswersList.projectType = 'Refurbishing the existing building'
    questionBankAnswers['project-type-A2'] = 'Refurbishing the existing building'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"refurbishing-insulation\" class=\"govuk-back-link\">Back</a>')

    delete questionBankAnswers['project-type-A2']
    delete selectedAnswersList.projectType
    delete selectedAnswersList.poultryType
  })

  it('page loads with correct back link - /replacing-insulation', async () => {
    selectedAnswersList.poultryType = 'Hens'
    selectedAnswersList.projectType = 'project type'
    questionBankAnswers['project-type-A2'] = 'Not matching project type'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"replacing-insulation\" class=\"govuk-back-link\">Back</a>')

    delete questionBankAnswers['project-type-A2']
    delete selectedAnswersList.projectType
    delete selectedAnswersList.poultryType
  })

  it('page loads with correct back link - /pullet-housing-requirements', async () => {
    selectedAnswersList.poultryType = 'Pullets'
    // questionBankAnswers['poultry-type-A2'] = 'Pullets'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/lighting-features`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-housing-requirements\" class=\"govuk-back-link\">Back</a>')
    delete selectedAnswersList.poultryType
  })
})
