const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /pullet-housing-requirements', () => {
  let varList = {}
  
  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the pullet housing have these features?')
    expect(response.payload).toContain('The pullet housing must have:')
    expect(response.payload).toContain('a useable area provided over a range of bird-accessible heights from 10 days of age')
    expect(response.payload).toContain('height adjustable perches at equal to or more than 8cm per pullet')
    expect(response.payload).toContain('a minimum of 50% of the floor area covered in litter')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the pullet housing will have these features')
  })

  it('user selects eligible option -> store user response and redirect to /multi-tier-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletHousingRequirements: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('multi-tier-system')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { pulletHousingRequirements: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The pullet housing must have:')
    expect(postResponse.payload).toContain('a useable area provided over a range of bird-accessible heights from 10 days of age')
    expect(postResponse.payload).toContain('height adjustable perches at equal to or more than 8cm per pullet')
    expect(postResponse.payload).toContain('a minimum of 50% of the floor area covered in litter')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /housing-density', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/pullet-housing-requirements`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"housing-density\" class=\"govuk-back-link\">Back</a>')
  })
})
