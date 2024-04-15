const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /applicant-details', () => {
  const varList = { applying: 'Applicant' }

  const valList = {}

  commonFunctionsMock(varList, undefined, {}, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Applicant’s details')
    expect(response.payload).toContain('First name')
    expect(response.payload).toContain('Last name')
    expect(response.payload).toContain('Email address')
    expect(response.payload).toContain('Mobile phone number')
    expect(response.payload).toContain('Landline number')
    expect(response.payload).toContain('Business address')
    expect(response.payload).toContain('Address line 1')
    expect(response.payload).toContain('Address line 2 (optional)')
    expect(response.payload).toContain('Town')
    expect(response.payload).toContain('County')
    expect(response.payload).toContain('Business postcode')
    expect(response.payload).toContain('Project postcode')
  })

  it('no option selected -> show error message', async () => {

    valList.firstName = {
      error: 'Enter your first name',
      
      return: false
    }

    valList.lastName = {
      error: 'Enter your last name',
      
      return: false
    }

    valList.emailAddress = {
      error: 'Enter your email address',
      
      return: false
    }

    valList.confirmEmailAddress = {
      error: 'Confirm your email address',
      
      return: false
    }

    valList.mobileNumber = {
      error: 'Enter a mobile phone number (if you do not have a mobile, enter your landline number)',
      
      return: false
    }

    valList.landlineNumber = {
      error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
      
      return: false
    }

    valList.address1 = {
      error: 'Enter your address line 1',
      
      return: false
    }

    valList.town = {
      error: 'Enter your town',
      
      return: false
    }

    valList.county = {
      error: 'Select your county',
      return: false
    }

    valList.postcode = {
      error: 'Enter a business postcode, like AA1 1AA',
      return: false
    }

    valList.projectPostcode = {
      error: 'Enter a project postcode, like AA1 1AA',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { farmerDetails: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your first name')
    expect(postResponse.payload).toContain('Enter your last name')
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
    expect(postResponse.payload).toContain('Enter your town')
    expect(postResponse.payload).toContain('Select your county')
    expect(postResponse.payload).toContain('Enter your address line 1')
    expect(postResponse.payload).toContain('Enter a business postcode, like AA1 1AA')
    expect(postResponse.payload).toContain('Enter a project postcode, like AA1 1AA')
  })

  it('user came from \'CHECK DETAILS\' page -> display <Back to details> button', async () => {
    varList.reachedCheckDetails = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Back to details')
  })


  it('validate first name - no digits', async () => {
    
    valList.firstName = {
      error: 'First name must only include letters, hyphens and apostrophes',
      
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        firstName: 'Jonathan 123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('First name must only include letters, hyphens and apostrophes')
  })

  it('validate last name - no digits', async () => {
    valList.lastName = {
      error: 'Last name must include letters',
      
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        lastName: '123',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Last name must include letters')
  })

  it('validate email', async () => {
    valList.emailAddress = {
      error: 'Enter an email address in the correct format, like name@example.com',
      
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        emailAddress: 'my@@name.com',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address in the correct format, like name@example.com')
  })

  it('validate mobile (optional) - at least 10 characters', async () => {
    valList.mobileNumber = {
      error: 'Your mobile number must have at least 10 characters',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        mobileNumber: '12345679',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Your mobile number must have at least 10 characters')
  })

  it('validate mobile (optional) - correct format', async () => {
    valList.mobileNumber = {
      error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        mobileNumber: '12345679a0${',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('validate landline (optional) - at least 10 characters', async () => {
    valList.landlineNumber = {
      error: 'Your landline number must have at least 10 characters',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        landlineNumber: '12345679',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Your landline number must have at least 10 characters')
  })

  it('validate town: fail when user adds non text characters (digits or other characters)', async () => {
    valList.town = {
      error: 'Town must only include letters',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        town: 'Highbury23',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Town must only include letters')
  })

  it('validate landline (optional) - correct format', async () => {
    valList.landlineNumber = {
      error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        landlineNumber: '12345679a0${',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('if both mobile and landline are missing -> show error message', async () => {
    valList.landlineNumber = {
      error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
      return: false
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my@name.com',
        address1: 'Address line 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
  })

  it('validate business postcode - valid format', async () => {
    valList.postcode = {
      error: 'Enter a business postcode, like AA1 1AA',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        postcode: 'aa1aa',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a business postcode, like AA1 1AA')
  })

  it('validate project postcode - valid format', async () => {
    valList.projectPostcode = {
      error: 'Enter a project postcode, like AA1 1AA',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectPostcode: 'aa1aa',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a project postcode, like AA1 1AA')
  })

  it('should validate email - confirmation mismatch', async () => {
    valList.confirmEmailAddress = {
      error: 'Enter an email address that matches',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'test1@gmail.com',
        confirmEmailAddress: 'test2@gmail.com',
        mobileNumber: '07700 900 982',
        address1: 'Address line 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address that matches')
  })

  it('store user response and redirect to /check-details', async () => {
    valList.firstName = null
    valList.lastName = null
    valList.emailAddress = null
    valList.confirmEmailAddress = null
    valList.mobileNumber = null
    valList.landlineNumber = null
    valList.address1 = null
    valList.address2 = null
    valList.town = null
    valList.county = null
    valList.projectPostcode = null
    valList.postcode = null

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my1.email1@my2-domain2.com',
        confirmEmailAddress: 'my1.email1@my2-domain2.com',
        mobileNumber: '07700 900 982',
        address1: 'Address line 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('check-details')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"applying\" class=\"govuk-back-link\">Back</a>')
  })
})
