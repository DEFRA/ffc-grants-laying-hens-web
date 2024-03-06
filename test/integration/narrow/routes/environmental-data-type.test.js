const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken, testNextLink } = require('./test-helper')

describe('Page: /environmental-data-type', () => {
    let varList = {}

    let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/environmental-data-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What additional environmental data will you automatically collect and store?')
    expect(response.payload).toContain('Using digital systems')
    expect(response.payload).toContain('Select all that apply')
    expect(response.payload).toContain('Ammonia')
    expect(response.payload).toContain('Carbon monoxide')
    expect(response.payload).toContain('Inhalable dust')
    expect(response.payload).toContain('Other')
    expect(response.payload).toContain('or')
    expect(response.payload).toContain('I will not collect and store additional environmental data')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select what additional environment data you will automatically collect and store',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/environmental-data-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what additional environment data you will automatically collect and store')
  })

  for(let option of ['Ammonia', 'Carbon monoxide', 'Inhalable dust', 'Other', 'I will not collect and store additional environmental data']) {
    it(`user selects eligible option - ${option} -> store user response and redirect to /score`, async () => {
      await testNextLink('environmental-data-type', 'environmentalDataType', option, 'score')
    })
  }

  it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/environmental-data-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"bird-data-type\" class=\"govuk-back-link\">Back</a>' )
    })
})
