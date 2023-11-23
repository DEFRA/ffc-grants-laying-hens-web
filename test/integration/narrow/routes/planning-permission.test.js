const { crumbToken } = require('./test-helper')

describe('Page: /planning-permission', () => {
  const varList = {
    inEngland: 'randomData',
    'current-score': null
  }

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
      url: `${global.__URLPREFIX__}/planning-permission`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does the project have planning permission?')
    expect(response.payload).toContain('Not needed')
    expect(response.payload).toContain('Secured')
    expect(response.payload).toContain('Should be in place by the time I make my full application')
    expect(response.payload).toContain('Will not be in place by the time I make my full application')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have project planning permission')
  })


  it('user selects conditional option: \'Expected to have by 31 January 2025\' -> display conditional page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: 'Should be in place by the time I make my full application', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planning-permission-condition')
  })

  it('should load the condition page with correct heading', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-condition`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('You may be able to apply for a grant from this scheme')
  })

  it('user selects eligible option [Approved | Applied for but not yet approved]-> store user response and redirect to /project-start', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: 'Secured', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-started')
  })

  it('user selects ineligible option `Will not be in place by the time I make my full application` and display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: 'Will not be in place by the time I make my full application', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
})
