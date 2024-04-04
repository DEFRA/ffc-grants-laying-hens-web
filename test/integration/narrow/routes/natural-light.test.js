const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /natural-light', () => {
  let varList = {
    poultryType: 'hen',
  }

  let valList = {}
  
  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/natural-light`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will the building have windows that provide natural light to the indoor housing?')
    expect(response.payload).toContain('The windows must be:')
    expect(response.payload).toContain('fitted with an insulated blind to manage light intensity and housing temperature')
    expect(response.payload).toContain('equal to at least 3% of size of the bird space footprint')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    valList['NOT_EMPTY'] = {
      error: 'Select yes if the building will have windows that provide natural light to the indoor housing',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/natural-light`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the building will have windows that provide natural light to the indoor housing')
  })

  it('user selects eligible option -> store user response and redirect to /easy-grip-perches - hen', async () => {
    varList.poultryType = 'hen'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/natural-light`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { naturalLight: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('easy-grip-perches')
  })

  it('user selects eligible option -> store user response and redirect to /dark-brooders - pullet', async () => {
    varList.poultryType = 'pullet'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/natural-light`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { naturalLight: 'Yes',  crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('dark-brooders')
  })
  
  it('page loads with correct back link - /hen-multi-tier', async () => {
    varList.poultryType = 'hen'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/natural-light`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"hen-multi-tier\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link - /pullet-multi-tier', async () => {
    varList.poultryType = 'pullet'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/natural-light`,
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"pullet-multi-tier\" class=\"govuk-back-link\">Back</a>')
  })
})
