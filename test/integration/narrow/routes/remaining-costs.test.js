const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /remaining-costs', () => {
  const varList = {
    projectCost: '1234567',
    calculatedGrant: '312000',
    remainingCost: 740740.20
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

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
    valList.remainingCosts = {
      error: 'Select yes if you can pay the remaining costs',
      return: false
    }
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
    valList.remainingCosts = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  // it('user selects eligible option: \'Yes\' -> store user response and redirect to /planning-permission', async () => {
  //   const postOptions = {
  //     method: 'POST',
  //     url: `${global.__URLPREFIX__}/remaining-costs`,
  //     headers: { cookie: 'crumb=' + crumbToken },
  //     payload: { remainingCosts: 'Yes', crumb: crumbToken }
  //   }

  //   const postResponse = await global.__SERVER__.inject(postOptions)
  //   expect(postResponse.statusCode).toBe(302)
  //   expect(postResponse.headers.location).toBe('housing')
  // })

  // it('page loads with correct back link - potential-amount-conditional', async () => {
  //   varList.calculatedGrantCalf = 500000
  //   const options = {
  //     method: 'GET',
  //     url: `${global.__URLPREFIX__}/remaining-costs`
  //   }
  //   const response = await global.__SERVER__.inject(options)
  //   expect(response.statusCode).toBe(200)
  //   expect(response.payload).toContain('<a href=\"/laying-hens/potential-amount-conditional\" class=\"govuk-back-link\">Back</a>')
  // })

  // it('page loads with correct back link - potential-amount-capped', async () => {
  //   varList.projectCost = 12600000
  //   varList.SolarPVCost = null
  //   const options = {
  //     method: 'GET',
  //     url: `${global.__URLPREFIX__}/remaining-costs`
  //   }
  //   const response = await global.__SERVER__.inject(options)
  //   expect(response.statusCode).toBe(200)
  //   expect(response.payload).toContain('<a href=\"/laying-hens/potential-amount-capped\" class=\"govuk-back-link\">Back</a>')
  // })

  // it('page loads with correct back link - potential-amount', async () => {
  //   varList.projectCost = 499999

  //   const options = {
  //     method: 'GET',
  //     url: `${global.__URLPREFIX__}/remaining-costs`
  //   }
  //   const response = await global.__SERVER__.inject(options)
  //   expect(response.statusCode).toBe(200)
  //   expect(response.payload).toContain('<a href=\"/laying-hens/potential-amount\" class=\"govuk-back-link\">Back</a>')
  // })
})
