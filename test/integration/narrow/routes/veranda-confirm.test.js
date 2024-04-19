const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('confirm page', () => {

  const OLD_ENV = process.env

  beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
  })

  afterAll(() => {
      process.env = OLD_ENV
  })

  const varList = { 
    farmerDetails: 'someValue', 
    contractorsDetails: 'someValue',
    projectType: 'Adding a veranda only to the existing building'
  }
  
  let valList = {}
  const utilsList = {
    'project-type-A1': 'Adding a veranda only to the existing building',
    'project-responsibility-A2': 'No, I plan to ask my landlord to take full responsibility for my project'
  }


  commonFunctionsMock(varList, 'Error', utilsList, valList)
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-confirm`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('I confirm that, to the best of my knowledge, the details I have provided are correct.')
    expect(response.payload).toContain('I understand the project’s eligibility and score is based on the answers I provided.')
    expect(response.payload).toContain('I am aware that the information I submit will be checked by the RPA.')
    expect(response.payload).toContain('I understand that the RPA will award the veranda-only grant funding on a first come, first served basis')
    expect(response.payload).toContain('Improving our schemes')
    expect(response.payload).toContain('As we develop new services we get feedback from farmers and agents.')
    expect(response.payload).toContain('You may be contacted by us or a third party that we work with')
    expect(response.payload).toContain('I consent to being contacted by Defra or a third party about service improvements')
    expect(response.payload).toContain('Confirm and send')
  })

  it('store user response and redirect to /veranda-confirmation', async () => {
    process.env.VERANDA_FUNDING_CAP_REACHED = 'true'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-confirm`,
      payload: { consentOptional: 'some conscent', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-confirmation')
  })

  it('store user response and redirect to /veranda-waitlist-confirmation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-confirm`,
      payload: { consentOptional: 'some conscent', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/laying-hens/veranda-waitlist-confirmation')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-confirm`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"check-details\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
