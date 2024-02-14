const { crumbToken } = require('./test-helper')

describe('Page: /veranda-remaining-costs', () => {
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
      url: `${global.__URLPREFIX__}/veranda-remaining-costs`
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
      url: `${global.__URLPREFIX__}/veranda-remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaRemainingCosts: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs')
  })

  it('user selects ineligible option: \'No\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaRemainingCosts: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects eligible option: \'Yes\' -> store user response and redirect to /business-details', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-remaining-costs`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaRemainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('business-details')
  })

  it('page loads with correct back link - potential-amount-conditional', async () => {
    varList.calculatedGrantCalf = 500000
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-remaining-costs`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"veranda-potential-amount\" class=\"govuk-back-link\">Back</a>')
  })
})
