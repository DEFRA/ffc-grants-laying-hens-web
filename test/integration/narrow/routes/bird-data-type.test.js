const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken, testNextLink } = require('./test-helper')

const utilsList = {
  'poultry-type-A1': 'hen',
  'poultry-type-A2': 'pullet'
}

describe('Page: /bird-data-type', () => {
  let varList = {
    poultryType: 'hen',
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, utilsList, valList)

  it(`page loads successfully, with all the options when poultry type is 'hen' `, async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/bird-data-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What poultry management data will you automatically collect and store?')
    expect(response.payload).toContain('Using digital systems')
    expect(response.payload).toContain('Select all that apply')
    expect(response.payload).toContain('Bird location')
    expect(response.payload).toContain('Egg production parameters')
    expect(response.payload).toContain('Body weight')
    expect(response.payload).toContain('Disease detection')
    expect(response.payload).toContain('Feed date or conversion ratios')
    expect(response.payload).toContain('Locomotion or movement')
    expect(response.payload).toContain('Nest use')
    expect(response.payload).toContain('Sound analysis')
    expect(response.payload).toContain('Other')
    expect(response.payload).toContain('or')
    expect(response.payload).toContain('None of the above')
  })

  it(`page loads successfully, with all the options when poultry type is 'pullet' `, async () => {
    varList.poultryType = 'pullet'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/bird-data-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What poultry management data will you automatically collect and store?')
    expect(response.payload).toContain('Using digital systems')
    expect(response.payload).toContain('Select all that apply')
    expect(response.payload).toContain('Bird location')
    expect(response.payload).toContain('Body weight')
    expect(response.payload).toContain('Disease detection')
    expect(response.payload).toContain('Feed date or conversion ratios')
    expect(response.payload).toContain('Locomotion or movement')
    expect(response.payload).toContain('Sound analysis')
    expect(response.payload).toContain('Other')
    expect(response.payload).toContain('or')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select what poultry management data you will automatically collect and store',
      return: false
    }
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

  for(let option of ['Bird location', 'Egg production parameters', 'Body weight', 'Disease detection', 'Feed date or conversion ratios', 'Locomotion or movement', 'Nest use', 'Sound analysis', 'Other', 'None of the above']) {
    it(`user selects eligible option - ${option} -> store user response and redirect to /environmental-data-type`, async () => {
      await testNextLink('bird-data-type', 'birdDateType', option, 'environmental-data-type')
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
