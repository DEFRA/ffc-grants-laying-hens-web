const { crumbToken } = require('./test-helper')
const { commonFunctionsMock } = require('../../../session-mock')

describe('Page: /applicant-type', () => {
  
  let varList = {}
  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of farmer are you?')
    expect(response.payload).toContain('Laying hens (including pullets)')
    expect(response.payload).toContain('Meat chickens')
    expect(response.payload).toContain('Beef (including calf rearing)')
    expect(response.payload).toContain('Dairy (including calf rearing)')
    expect(response.payload).toContain('Pigs')
    expect(response.payload).toContain('Sheep')
    expect(response.payload).toContain('Aquaculture')
    expect(response.payload).toContain('Horticulture')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    valList.applicantType = {
      error: 'Select what type of farmer you are',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what type of farmer you are')
  })
  it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    valList.applicantType = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('This grant is for laying hen or pullet farmers.')
  })

  it('user selects eligible option -> store user response and redirect to /legal-status', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applicantType: ['fake type', 'fake type2'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('legal-status')
  })
  it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/applicant-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-type\" class=\"govuk-back-link\">Back</a>' )
    })
})
