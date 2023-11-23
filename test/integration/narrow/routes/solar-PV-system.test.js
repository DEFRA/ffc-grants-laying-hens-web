const { crumbToken } = require('./test-helper')

describe('Page: /solar-PV-system', () => {
  const varList = {
    legalStatus: 'randomData',
    upgradingExistingBuilding: 'No',
    heritageSite: 'fakeData'
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
      url: `${global.__URLPREFIX__}/solar-PV-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will you buy a solar PV system with this grant?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-PV-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if you will use the grant for a solar PV system')
  })

  it('user selects eligible option: \'Yes\' -> display project-cost-solar', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-PV-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarPVSystem: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost-solar')
  })

  it('user selects option: \'No\' -> display project-cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-PV-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarPVSystem: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('page loads with correct back link -> if upgradingExistingData is `No`, go back to heritage-site', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-PV-system`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"heritage-site\" class=\"govuk-back-link\">Back</a>')
  })
})
