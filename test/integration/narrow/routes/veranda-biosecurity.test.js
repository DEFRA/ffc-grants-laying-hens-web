const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /veranda-biosecurity', () => {
  const varList = {}
  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-biosecurity`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the veranda be biosecure?')
    expect(response.payload).toContain('The veranda must have:')
    expect(response.payload).toContain('a mesh roller screen with a mesh hole size of 6mm or less running underneath the length of the roof, that fits securely against the wall when extended')
    expect(response.payload).toContain('closable pop holes along the length of the building which are at least 35cm high and 40cm wide, unless the veranda is part of an indoor barn system')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.verandaBiosecurity = {
      error: 'Select yes if the veranda will be biosecure',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-biosecurity`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { verandaBiosecurity: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the veranda will be biosecure')
  })

  it('user selects eligible option -> store user response and redirect to /veranda-project-cost', async () => {
    valList.verandaBiosecurity = null
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
    expect(postResponse.payload).toContain('The veranda must have:')
    expect(postResponse.payload).toContain('a mesh roller screen with a mesh hole size of 6mm or less running underneath the length of the roof, that fits securely against the wall when extended')
    expect(postResponse.payload).toContain('closable pop holes along the length of the building which are at least 35cm high and 40cm wide, unless the veranda is part of an indoor barn system.')
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
