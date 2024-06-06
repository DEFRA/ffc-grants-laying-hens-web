const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /business-details', () => {
  const varList = { 'current-score': 'randomData' }

  let valList = {}

  commonFunctionsMock(varList, 'Error', {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Business details')
    expect(response.payload).toContain('Project name')
    expect(response.payload).toContain('Business name')
    expect(response.payload).toContain('Number of employees')
    expect(response.payload).toContain('Annual business turnover (£)')
    expect(response.payload).toContain('Single Business Identifier')
    expect(response.payload).toContain('County parish holding (CPH) number')
  })

  it('no option selected -> show error message', async () => {
    valList.projectName = {
      error: 'Enter a project name',
      return: false
    }

    valList.businessName = {
      error: 'Enter a business name',
      return: false
    }

    valList.numberEmployees = {
      error: 'Enter the number of employees',
      return: false
    }

    valList.businessTurnover = {
      error: 'Enter your annual business turnover',
      return: false
    }

     valList.cph = {
      error: 'Enter your Country parish holding (CPH) number',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { businessDetails: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a project name')
    expect(postResponse.payload).toContain('Enter a business name')
    expect(postResponse.payload).toContain('Enter the number of employees')
    expect(postResponse.payload).toContain('Enter your annual business turnover')
    expect(postResponse.payload).toContain('Enter your Country parish holding (CPH) number')
  })

  it('user came from \'CHECK DETAILS\' page -> display <Back to details> button', async () => {
    varList.reachedCheckDetails = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Back to details')
  })

  it('should validate project name - maximum characters is 30', async () => {
    valList.projectName = {
      error: 'Project name must be 30 characters or fewer',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'qwwwrtayuopliuytglpomnhytyiokee', // 31
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Project name must be 30 characters or fewer')
  })

  it('should validate business name - maximum characters is 30', async () => {

    valList.businessName = {
      error: 'Business name must be 30 characters or fewer',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessName: 'qwwwrtayuopliuytglpomnhytyiokee', // 31,
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business name must be 30 characters or fewer')
  })

  it('should validate number of employees - no spaces', async () => {
    valList.numberEmployees = {
      error: 'Number of employees must be a whole number, like 305',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        numberEmployees: '123 45',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number of employees must be a whole number, like 305')
  })

  it('should validate number of employees - maximum number of employees is 9999999', async () => {
    valList.numberEmployees = {
      error: 'Number must be between 1-9999999',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        numberEmployees: '12345678',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number must be between 1-9999999')
  })

  it('should validate number of employees - minimum number of employees is 1', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        numberEmployees: '0',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number must be between 1-9999999')
  })

  it('should validate business turnover - only digits', async () => {
    valList.businessTurnover = {
      error: 'Enter your annual business turnover, in pounds',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '124e',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your annual business turnover, in pounds')
  })

  it('should validate business turnover - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '123 45',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your annual business turnover, in pounds')
  })

  it('should validate business turnover - maximum value is 999999999', async () => {
    valList.businessTurnover = {
      error: 'Enter your annual business turnover, in pounds',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '1234567890',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your annual business turnover, in pounds')
  })

  it('should validate business turnover - minimum value is 0', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        businessTurnover: '0',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your annual business turnover, in pounds')
  })

  it('should validate SBI, if entered - only digits', async () => {
    valList.sbi = {
      error: 'SBI number must have 9 characters, like 011115678',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123e',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI, if entered - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123 45',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be less than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '12345678',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be more than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '1234567890',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate CPH - only digits', async () => {
    valList.cph = {
      error: 'Enter your Country parish holding CPH number, like 12/345/6789',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123456789',
        cph: 'ab/345/6789',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your Country parish holding CPH number, like 12/345/6789')
  })

  it('should validate CPH - digits must not be more than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123456789',
        cph: '12/345/6789',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your Country parish holding CPH number, like 12/345/6789')
  })

  it('should validate CPH - digits must not be less than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123456789',
        cph: '12/345/678',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your Country parish holding CPH number, like 12/345/6789')
  })

  it('should validate CPH - characters between numbers must not be different', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123456789',
        cph: '12/345-6789',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your Country parish holding CPH number, like 12/345/6789')
  })

  it('should validate CPH - characters between numbers must be spaces, hyphens, full stops and slashes only', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123456789',
        cph: '12*345*6789',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your Country parish holding CPH number, like 12/345/6789')
  })

  it('store user response and redirect to applicant page: /applying, sbi is optional', async () => {
    valList.projectName = null
    valList.businessName = null
    valList.numberEmployees = null
    valList.businessTurnover = null
    valList.sbi = null
    valList.cph = null

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        cph: '12/345/6789',
        calvingSystem: 'Other',
        calvesNumber: '123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applying')
  })

  it('store user response and redirect to applicant page: /applying', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '012345678',
        cph: '12/345/6789',
        calvingSystem: 'Other',
        calvesNumber: '123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applying')
  })
})
