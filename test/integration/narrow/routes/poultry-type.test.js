const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /poultry-type', () => {
  const varList = {
    tenancy: 'Yes',
    projectType: ''
  }

  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/poultry-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of poultry is the project for?')
    expect(response.payload).toContain('Laying hens (over 15 weeks old)')
    expect(response.payload).toContain('Pullets (up to and including 15 weeks old)')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/poultry-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what type of poultry the project is for')
  })

  it('user selects eligible option and projectType is `Replacing an existing laying hen or pullet with a new building` -> store user response and redirect to /1000-birds', async () => {
    varList.projectType = 'Replacing an existing laying hen or pullet with a new building'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/poultry-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: 'hen', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('1000-birds')
  })

  it('user selects eligible option and projectType is `Adding a veranda only to an existing laying hen or pullet building` -> store user response and redirect to /veranda-only', async () => {
    varList.projectType = 'Adding a veranda only to an existing laying hen or pullet building'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/poultry-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: 'hen', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-only')
  })

  it('user selects ineligible option `None of the above` -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/poultry-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { poultryType: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('This grant is only for laying hen or pullet projects.')
    expect(postResponse.payload).toContain('See other grants you may be eligible for.')
  })

  it('`Yes` option selected on /tenancy -> page loads with correct back link', async () => {
    varList.tenancy = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/poultry-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="tenancy" class="govuk-back-link">Back</a>')
  })

  it('`No` option selected on /tenancy -> page loads with correct back link', async () => {
    varList.tenancy = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/poultry-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="project-responsibility" class="govuk-back-link">Back</a>')
  })
})
