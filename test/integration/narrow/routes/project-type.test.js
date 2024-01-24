const { crumbToken } = require('./test-helper')

describe('Page: /project-type', () => {
  const varList = {
    poultryType: 'Laying hens'
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
      url: `${global.__URLPREFIX__}/project-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is your project?')
    expect(response.payload).toContain('Replacing existing housing')
    expect(response.payload).toContain('Refurbishing existing housing')
    expect(response.payload).toContain('Adding a veranda only to existing housing')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what is your project')
  })

it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects `Adding a veranda only to existing housing` -> store user response and redirect to /business-details', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Adding a veranda only to existing housing', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('business-details')
  })

  it('user selects `Replacing existing housing` -> store user response and redirect to /building-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Replacing existing housing', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('building-items')
  })

  it('user selects `Refurbishing existing housing` -> store user response and redirect to /building-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Replacing existing housing', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('building-items')
  })

  it('page loads with correct back link ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"poultry-type\" class=\"govuk-back-link\">Back</a>')
  })
})
