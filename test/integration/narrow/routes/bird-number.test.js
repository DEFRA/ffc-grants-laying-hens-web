const { crumbToken } = require('./test-helper')

describe('Page: /1000-birds', () => {
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
      url: `${global.__URLPREFIX__}/1000-birds`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Do you have at least 1,000 birds on your farm currently?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you currently have at least 1,000 birds on your farm')
  })

  it('user selects eligible option -> store user response and redirect to /roof-solar-PV', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('legal-status')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/1000-birds`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { birdNumber: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('You must have at least 1,000 birds on your farm currently.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /applicant-type', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/1000-birds`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"applicant-type\" class=\"govuk-back-link\">Back</a>')
  })
})
