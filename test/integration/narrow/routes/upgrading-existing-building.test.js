const { crumbToken } = require('./test-helper')

describe('Page: /upgrading-existing-building', () => {
  const varList = {
    legalStatus: 'randomData',
    roofSolarPV: 'fakeData'
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
      url: `${global.__URLPREFIX__}/upgrading-existing-building`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Are you upgrading an existing building and not making changes to the roof?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/upgrading-existing-building`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if you are upgrading an existing building and not making changes to the roof')
  })

  it('user selects eligible option: \'Yes\' -> display solar-PV-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/upgrading-existing-building`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { upgradingExistingBuilding: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-PV-system')
  })

  it('user selects option: \'No\' -> display heritage-site page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/upgrading-existing-building`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { upgradingExistingBuilding: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('heritage-site')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/upgrading-existing-building`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"roof-solar-PV\" class=\"govuk-back-link\">Back</a>')
  })
})
