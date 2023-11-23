const { crumbToken } = require('./test-helper')
const varListTemplate = {
  legalStatus: 'randomData',
  upgradingExistingBuilding: 'fakeData',
  project: 'some fake project'
}
let varList

const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return undefined
  }
}
jest.mock('../../../../app/helpers/session', () => mockSession)

describe('Page: /heritage-site', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/heritage-site`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is your building listed or on a World Heritage Site?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/heritage-site`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if your building is listed or on a World Heritage Site')
  })

  it('user selects eligible option: \'Yes\' -> display solar-PV-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/heritage-site`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { heritageSite: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-PV-system')
  })

  it('user selects option: \'No\' -> display project-cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/heritage-site`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { heritageSite: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('page loads with correct back link when user selected upgrading existing building in project page', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/heritage-site`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"upgrading-existing-building\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when user selected new calf hosuing in project page', async () => {
    varList = { project: 'Building new calf housing' }
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/heritage-site`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"roof-solar-PV\" class=\"govuk-back-link\">Back</a>')
  })
})
