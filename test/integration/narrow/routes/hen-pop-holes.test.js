const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /hen-pop-holes', () => {
  const varList = {}

  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-pop-holes`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the internal hen housing have lockable pop holes for the hens to enter the veranda through?')
    expect(response.payload).toContain('You must not put perches in front of the pop holes')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-pop-holes`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the internal hen housing will have lockable pop holes')
  })

  it('user selects eligible option -> store user response and redirect to /concrete-apron', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-pop-holes`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henPopHoles: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('concrete-apron')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/hen-pop-holes`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { henPopHoles: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('Pop holes must:')
    expect(postResponse.payload).toContain('be at least 35cm high and 40cm wide')
    expect(postResponse.payload).toContain('extend along the entire length of the building')
    expect(postResponse.payload).toContain('The pop hole openings must add up to a total of 2 metres for every 1,000 hens.')
    expect(postResponse.payload).toContain('The base of all pop holes must either be less than 30cm from floor level, or have access ramps that are as wide as the pop holes.')
    expect(postResponse.payload).toContain('You must not put perches in front of the pop holes.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/hen-pop-holes`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-veranda-biosecurity\" class=\"govuk-back-link\">Back</a>')
  })
})
