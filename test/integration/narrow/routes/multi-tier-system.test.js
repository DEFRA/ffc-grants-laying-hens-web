const { crumbToken } = require('./test-helper')

describe('Page: /multi-tier-system', () => {
  let varList = {}
  
  jest.mock('ffc-grants-common-functionality', () => ({
    session: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return undefined
      }
    },
    regex: {
      PROJECT_COST_REGEX: /^[1-9]\d*$/
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/multi-tier-system`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which multi-tier system will the pullet housing have?')
    expect(response.payload).toContain('Rearing aviary')
    expect(response.payload).toContain('A system that houses birds within tiers during the first 2 weeks of rearing, that you can open to enable them to access the barn flow after 2 weeks')
    expect(response.payload).toContain('Step-up system')
    expect(response.payload).toContain('A floor system that can change to match a rearing aviary post-brooding, with adjustable elevated tiers you can add and gradually raise as the birds grow')
    expect(response.payload).toContain('or')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/multi-tier-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what multi-tier system the pullet housing will have')
  })

  it('user selects eligible option `Rearing aviary` -> store user response and redirect to /rearing-aviary-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/multi-tier-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { multiTierSystem: 'Rearing aviary',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('rearing-aviary-system')
  })

  it('user selects eligible option `Step-up system` -> store user response and redirect to /step-up-system', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/multi-tier-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { multiTierSystem: 'Step-up system',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('step-up-system')
  })


  it('user selects ineligible option `None of the above` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/multi-tier-system`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { multiTierSystem: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('The pullet housing must have a multi-tier system.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('page loads with correct back link - /pullet-housing-requirements', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/multi-tier-system`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-housing-requirements\" class=\"govuk-back-link\">Back</a>')
  })
})
