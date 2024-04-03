const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /changing-area', () => {
  const varList = {
    poultryType: 'hen',
    projectType: 'Replacing the entire laying hen or pullet building with a new building including the grant funding required features'
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/changing-area`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have a biosecurity changing area at each external pedestrian access point?')
    expect(response.payload).toContain('Each biosecurity changing area must include:')
    expect(response.payload).toContain('changing facilities, with a step-over barrier between the outer and inner areas')
    expect(response.payload).toContain('in the outer area, handwashing facilities with running water and storage for clothes and boots that you use outside of this building')
    expect(response.payload).toContain('in the inner area, a footbath and storage for clothes and boots that you use inside of the bird living area')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList.changingArea = {
      error: 'Select yes if the building will have a biosecurity changing area',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/changing-area`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have a biosecurity changing area')
  })
  it('user selects eligible option -> store user response and redirect to /external-taps', async () => {
    valList.changingArea = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/changing-area`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { changingArea: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('external-taps')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/changing-area`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { changingArea: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The building must have a biosecurity changing area at each external pedestrian point.')
    expect(postResponse.payload).toContain('Each biosecurity changing area must include:')
    expect(postResponse.payload).toContain('changing facilities, with a step-over barrier between the outer and inner areas')
    expect(postResponse.payload).toContain('in the outer area, handwashing facilities with running water and storage for clothes and boots you use outside this building')
    expect(postResponse.payload).toContain('in the inner area, a footbath and storage for clothes and boots you use inside the bird living area.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link when poultry type is hen /egg-store-access', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/changing-area`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"egg-store-access\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back lin when poultry type is pullet /concrete-apron', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/changing-area`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"concrete-apron\" class=\"govuk-back-link\">Back</a>')
  })
})
