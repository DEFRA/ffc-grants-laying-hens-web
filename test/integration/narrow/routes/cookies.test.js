const { commonFunctionsMock } = require('../../../session-mock')
const { crumbToken } = require('./test-helper')

describe('Cookies page', () => {
    const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }

    commonFunctionsMock(varList, 'Error')
    
    it('page loads successfully, with all the options', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/cookies`,
            headers: {
                cookie: 'crumb=' + crumbToken
            }
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('analytics')
    })

    it('store user response ', async () => {
        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/cookies`,
            payload: { analytics: true, async: true, crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }

        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(200)
        expect(postResponse.payload).toBe('ok')
    })

    it('store user response if no async', async () => {
        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/cookies`,
            payload: { analytics: true, crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }

        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe('/laying-hens/cookies?updated=true')
    })

})
