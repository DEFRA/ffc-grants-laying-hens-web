const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('confirm page', () => {
  const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }

  commonFunctionsMock(varList, undefined)
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirm`,
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
    expect(response.payload).toContain('I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.')
    expect(response.payload).toContain('Improving our schemes')
    expect(response.payload).toContain('As we develop new services we get feedback from farmers and agents.')
    expect(response.payload).toContain('You may be contacted by us or a third party that we work with.')
    expect(response.payload).toContain('I consent to being contacted by Defra or a third party about service improvements')
    expect(response.payload).toContain('Confirm and send')
  })

  it('store user response and redirect to /confirmation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/confirm`,
      payload: { consentOptional: 'some conscent', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('confirmation')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirm`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"check-details\" class=\"govuk-back-link\"')
  })
})
