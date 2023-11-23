const { crumbToken } = require('./test-helper')

describe('Page: /introducing-innovation', () => {
    const varList = {
        legalStatus: 'randomData',
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
    url: `${global.__URLPREFIX__}/introducing-innovation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is your project introducing innovation?')
    expect(response.payload).toContain('Technology')
    expect(response.payload).toContain('Collaboration')
    expect(response.payload).toContain('Techniques')
    expect(response.payload).toContain('None of the above')
})
it('no option selected -> show error message', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/introducing-innovation`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { introducingInnovation: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how your project is introducing innovation')
})
it(' \'None of the above\' selected with another option -> show error message', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/introducing-innovation`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { introducingInnovation: ['None of the above', 'Collaboration'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot select that combination of options')
})
it('user selects eligible option -> store user response and redirect to /score', async () => {    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/introducing-innovation`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { introducingInnovation: ['Collaboration'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('score')
})
})
