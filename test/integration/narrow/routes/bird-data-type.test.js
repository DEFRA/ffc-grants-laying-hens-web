const { crumbToken, testNextLink } = require('./test-helper')

describe('Page: /bird-data-type', () => {
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
      url: `${global.__URLPREFIX__}/bird-data-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What poultry management data will you automatically collect and store?')
    expect(response.payload).toContain('Using digital systems')
    expect(response.payload).toContain('Select all that apply')
    expect(response.payload).toContain('Bird performance data')
    expect(response.payload).toContain('Body weight')
    expect(response.payload).toContain('Disease detection')
    expect(response.payload).toContain('Feed data or conversion ratios')
    expect(response.payload).toContain('Location data')
    expect(response.payload).toContain('Locomotion or movement data')
    expect(response.payload).toContain('Next use')
    expect(response.payload).toContain('Sound analysis')
    expect(response.payload).toContain('Other')
    expect(response.payload).toContain('or')
    expect(response.payload).toContain('I will not monitor any poultry management data')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/bird-data-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what poultry management data you will automatically collect and store')
  })

  for(let option of ['Bird performance data', 'Body weight', 'Disease detection', 'Feed data or conversion ratios', 'Location data', 'Locomotion or movement data', 'Next use', 'Sound analysis', 'Other', 'I will not monitor any poultry management data']) {
    it(`user selects eligible option - ${option} -> store user response and redirect to /score`, async () => {
      await testNextLink('bird-data-type', 'birdDataType', option, 'environmental-data-type')
    })
  }

  it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/bird-data-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"renewable-energy\" class=\"govuk-back-link\">Back</a>' )
    })
})
