const { crumbToken } = require('./test-helper')

describe('Page: /soiled-water-drainage', () => {
  let varList = {}
  
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
      url: `${global.__URLPREFIX__}/soiled-water-drainage`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the designated washing and disinfecting area have the drainage system and storage tanks for soiled water?')
    expect(response.payload).toContain('This is separate from rainwater drainage') 
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/soiled-water-drainage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the designated washing and disinfecting area will have a drainage system and storage tanks')
  })

  it('user selects eligible option -> store user response and redirect to /external-taps', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/soiled-water-drainage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { soiledWaterDrainage: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('external-taps')
  })

  it('user selects ineligible option `No` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/soiled-water-drainage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { soiledWaterDrainage: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The designated washing and disinfecting area must have a drainage system and storage tanks for soiled water.')
    expect(postResponse.payload).toContain('This is separate from rainwater drainage') 
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /concrete-apron', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/soiled-water-drainage`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"vehicle-washing\" class=\"govuk-back-link\">Back</a>')
  })
})
