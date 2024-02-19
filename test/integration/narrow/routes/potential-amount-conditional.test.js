const { crumbToken } = require('./test-helper')

xdescribe('Page: /potential-amount-conditional', () => {
    const varList = {
    projectCost: 2000000,
    calculatedGrant: 500000
    }
    const eligiblePageText = 'You have requested the maximum grant amount of £500,000 for calf housing.'

    jest.mock('ffc-grants-common-functionality', () => ({
      session: {
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
          if (varList[key]) return varList[key]
          else return undefined
        }
      },
      regex: {
        PROJECT_COST_REGEX: /^[1-9]\d*$/,
        SELECT_VARIABLE_TO_REPLACE: /{{_(.+?)_}}/ig
      }
    }))

it('page loads successfully, with all the Eligible options', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/potential-amount-conditional`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain(eligiblePageText)
})

it('should redirect to /remaining-costs when user press continue', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/potential-amount-conditional`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('remaining-costs')
})

// it('page loads with correct back link', async () => {
//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/potential-amount-conditional`
//     }
//     const response = await global.__SERVER__.inject(options)
//     expect(response.statusCode).toBe(200)
//     expect(response.payload).toContain('<a href=\"project-cost-solar\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
//     })
})
