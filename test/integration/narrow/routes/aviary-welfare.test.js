const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /aviary-welfare', () => {
  const varList = {
    poultryType: '',
  }

  let valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options, warning text and sidebar', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/aviary-welfare`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have a high welfare aviary system?')
    expect(response.payload).toContain('This system must enable the birds to move between levels without flying or jumping more than one metre in height')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    expect(response.payload).toContain('You must not install a combi-cage system in your grant-funded housing.')
    expect(response.payload).toContain('The building must have a high welfare aviary system.')
    expect(response.payload).toContain('The aviary system must have welfare ramps and platforms if the hens would need to jump or fly more than one metre in height to move between levels.')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the building will have a high welfare aviary system',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-welfare`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have a high welfare aviary system')
  })

  it('user selects eligible option -> store user response and redirect to /aviary-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-welfare`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviaryWelfare: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('aviary-system')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/aviary-welfare`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { aviaryWelfare: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The building must have a high welfare laying hen aviary system.')
    expect(postResponse.payload).toContain('You must not install a combi-cage system in your grant-funded housing.')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/aviary-welfare`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"lighting-features\" class=\"govuk-back-link\">Back</a>')
  })

})
