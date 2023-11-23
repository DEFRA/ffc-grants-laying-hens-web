const { crumbToken } = require('./test-helper')

describe('Page: /environmental-impact', () => {
    const varList = {
        legalStatus: 'randomData',
        SolarPVCost: null,
        projectType: 'fakeData'
    }
    
    jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return 'Error'
        }
    }))
it('page loads successfully, with all the options', async () => {
    const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/rainwater`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will your building collect and store rainwater?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
})
it('no option selected -> show error message', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/rainwater`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { environmentalImpact: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if your building will collect and store rainwater')
})

it('user selects eligible option -> store user response and redirect to /sustainable-materials', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/rainwater`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { environmentalImpact: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('sustainable-materials')
})
})
