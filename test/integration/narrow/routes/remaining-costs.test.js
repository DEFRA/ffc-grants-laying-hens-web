const { crumbToken } = require('./test-helper')

describe('Page: /remaining-costs', () => {
  const varList = { 
    projectCost: '1234567', 
    calculatedGrant: '312000', 
    remainingCost: 740740.20 
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Can you pay the remaining costs of £740,740.20?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs')
  })

  it('user selects ineligible option: \'No\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option: \'Yes\' -> store user response and redirect to /planning-permission', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('housing')
  })

  it('page loads with correct back link - potential-amount-conditional', async () => {
    varList.calculatedGrantCalf = 500000
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/upgrading-calf-housing/potential-amount-conditional\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link - potential-amount-solar-capped', async () => {
    varList.SolarPVCost = 2000000000
    varList.calculatedGrantSolar = 499999
    varList.calculatedGrantCalf = 499999
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/upgrading-calf-housing/potential-amount-solar-capped\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link - potential-amount-solar', async () => {
    varList.SolarPVCost = 5000
    // varList.calculatedGrantSolar = 499999
    varList.calculatedGrantCalf = 125000

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/upgrading-calf-housing/potential-amount-solar\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - potential-amount-capped', async () => {
    varList.projectCost = 12600000
    varList.SolarPVCost = null
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/upgrading-calf-housing/potential-amount-capped\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - potential-amount', async () => {
    varList.projectCost = 499999

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/upgrading-calf-housing/potential-amount\" class=\"govuk-back-link\">Back</a>')
  })
})
