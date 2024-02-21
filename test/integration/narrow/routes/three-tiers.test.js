const { crumbToken } = require('./test-helper')

describe('Page: /three-tiers', () => {
  let varList = {
    poultryType: 'hen',
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
      url: `${global.__URLPREFIX__}/three-tiers`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the multi-tier system have 3 tiers or fewer directly above each other?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/three-tiers`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the multi-tier system will have 3 tiers or fewer directly above each other')
  })

  it('user selects eligible option -> store user response and redirect to /multi-tier-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/three-tiers`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { threeTiers: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('multi-tier-system')
  })


  it('page loads with correct back link - /maximum-tier-height', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/three-tiers`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"maximum-tier-height\" class=\"govuk-back-link\">Back</a>')
  })
})
