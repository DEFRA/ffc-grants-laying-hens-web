const { crumbToken } = require('./test-helper')

describe('Page: /environmental-impact', () => {
    const varList = {
        legalStatus: 'randomData',
        SolarPVCost: 12345,
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
    url: `${global.__URLPREFIX__}/environmental-impact`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How will the building minimise environmental impact?')
    expect(response.payload).toContain('Solar PV panels on the roof of the building')
    expect(response.payload).toContain('Collect and store rainwater')
    expect(response.payload).toContain('None of the above')
})
it('no option selected -> show error message', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/environmental-impact`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { environmentalImpact: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how your building will minimise environmental impact')
})
it(' \'None of the above\' selected with another option -> show error message', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/environmental-impact`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { environmentalImpact: ['None of the above', 'Collect and store rainwater'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot select that combination of options')
})
it('user selects eligible option -> store user response and redirect to /sustainable-materials', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/environmental-impact`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { environmentalImpact: ['Solar PV panels on the roof of the building'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('sustainable-materials')
})
})
