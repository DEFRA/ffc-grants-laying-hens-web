const { crumbToken } = require('./test-helper')

describe('Page: /dark-brooders', () => {
  let varList = {}
  
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
      url: `${global.__URLPREFIX__}/dark-brooders`
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
      url: `${global.__URLPREFIX__}/dark-brooders`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the housing will include dark brooders')
  })

  it('user selects eligible option -> store user response and redirect to /renewable-energy', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/dark-brooders`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { darkBrooders: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('renewable-energy')
  })

  it('page loads with correct back link - /pullet-veranda-features', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/dark-brooders`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-veranda-features\" class=\"govuk-back-link\">Back</a>')
  })
})
