const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Page: /veranda-project-cost', () => {
const varList = {
  projectCost: '12345678'
}

let valList = {}

commonFunctionsMock(varList, undefined, {}, valList)
  
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is the estimated cost of the veranda?')
    expect(response.payload).toContain('You can only apply for a grant of up to 40% of the estimated costs. The minimum grant you can apply for this project is £5,000 (40% of £12,500). The maximum grant is £100,000 (40% of £250,000).')
    expect(response.payload).toContain('I am adding verandas to multiple buildings')
    expect(response.payload).toContain('Enter the costs of adding this veranda only')
    expect(response.payload).toContain('You must submit a separate application for each veranda.')
    expect(response.payload).toContain('Do not include VAT')
    expect(response.payload).toContain('Enter amount, for example 50,000')
  })

  it('should return an error message if no option is selected', async () => {
    valList.projectCost = {
      error: 'Enter the estimated cost of the veranda',
      return: false
    }

    valList['NOT_EMPTY'] = {
      error: 'Enter the estimated cost of the veranda',
      return: false
    }
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the estimated cost of the veranda')
  })

  it('should return an error message if a letter is typed in', async () => {
    valList.projectCost.error = 'Enter a whole number with a maximum of 7 digits'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { projectCost: '1234s6', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if number contains a space', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { projectCost: '1234 6', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if number contains a comma "," ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { projectCost: '123,456', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if a fraction is typed in - it contains a dot "." ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { projectCost: '123.456', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if the number of digits typed exceed 7', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { projectCost: '12345678', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should eliminate user if the cost entered is too low', async () => {
    valList.projectCost = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { projectCost: '12499', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('The minimum grant you can apply for is £5,000 (40%of £12,500)')
    expect(postResponse.payload).toContain('You can apply for grant funding to add verandas to multiple buildings. You must submit a separate application for each veranda.')
    expect(postResponse.payload).toContain('If the total grant funding for your combined veranda projects is more than £5,000 (40% of £12,500), you may still be eligible to apply for grant funding.')
    expect(postResponse.payload).toContain('If you are applying for grant funding for a single veranda, you can see other grants you may be eligible for.')
    expect(postResponse.payload).toContain('I am applying to add verandas to multiple buildings')
  })

  it('should store valid user input and redirect to veranda-potential-amount page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/veranda-project-cost`,
      payload: { projectCost: '35000', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('veranda-potential-amount')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-project-cost`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"veranda-features\" class=\"govuk-back-link\">Back</a>')
  })
})
