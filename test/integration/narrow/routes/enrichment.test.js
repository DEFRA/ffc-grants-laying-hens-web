const { crumbToken } = require('./test-helper')

describe('Page: /enrichment', () => {
  const varList = {
    legalStatus: 'randomData',
    projectType: 'fakeData',
    tenancy: 'Yes',
    tenancyLength: null,
    minimumFloorArea: '100kg or under',
    housedIndividually: 'Yes',
    isolateCalves: 'Yes'
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
      url: `${global.__URLPREFIX__}/enrichment`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will there be at least one enrichment item per pair or group of calves?')
    expect(response.payload).toContain('Not including straw bedding and social contact')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/enrichment`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if there will be at least one enrichment item per pair or group of calves')
  })

  it('user selects ineligible option: \'No\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/enrichment`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { enrichment: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('Each pair or group of calves must have at least one enrichment item (for example brushes or hanging balls).')
    expect(postResponse.payload).toContain('This does not include straw bedding and social contact.')
    expect(postResponse.payload).toContain('The grant will fund off-the-shelf items for cattle. Other enrichment items (for example cardboard boxes) are not funded.')
  })

  it('user selects eligible option -> store user response and redirect to /structure', async () => { // TODO: change to the correct next route once the page is ready
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/enrichment`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { enrichment: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('structure')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/enrichment`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"flooring-and-bedding\" class=\"govuk-back-link\">Back</a>')
  })
})
