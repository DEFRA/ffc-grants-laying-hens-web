const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /veranda-biosecurity', () => {
  const varList = {}

  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-biosecurity`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the veranda have the capacity to be made biosecure with mesh that has a spacing of 6mm or less?')
    expect(response.payload).toContain('This is to stop wild birds and rodents from entering during housing orders')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-biosecurity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaBiosecurity: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the veranda will have the capacity to be made biosecure')
  })

  it('user selects eligible option -> store user response and redirect to /veranda-project-cost', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-biosecurity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaBiosecurity: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-project-cost')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-biosecurity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaBiosecurity: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The veranda must be capable of being secured with mesh (with a maximum of 6mm spacing) during housing orders.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-biosecurity`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"veranda-features\" class=\"govuk-back-link\">Back</a>')
  })
})
