const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /easy-grip-perches', () => {
  const varList = {
    poultryType: 'hen',
  }

  commonFunctionsMock(varList, undefined)

  it('page loads successfully, with all the options - hen', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the perches have a design feature that help the hens grip the perches?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('page loads successfully, with all the options - pullet', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the perches have a design feature that help the pullets grip the perches?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message - hen', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/easy-grip-perches`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { easyGripPerches: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the perches will have a design feature that help the hens grip the perches')
  })

  it('no option selected -> show error message - pullet', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/easy-grip-perches`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { easyGripPerches: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the perches will have a design feature that help the pullets grip the perches')
  })

  it('user selects eligible option -> store user response and redirect to /building-biosecurity', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/easy-grip-perches`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { easyGripPerches: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('building-biosecurity')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/easy-grip-perches`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"natural-light\" class=\"govuk-back-link\">Back</a>')
  })

})
