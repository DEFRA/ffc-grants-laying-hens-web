const { crumbToken } = require('./test-helper')

const senders = require('../../../../app/messaging/senders')
const { commonFunctionsMock } = require('../../../session-mock')

describe('varanda confirm page', () => {
  const varList = { 
    farmerDetails: 'someValue', 
    projectType: 'Adding a veranda only to the existing building',
    projectResponsibility: ''
    }
    let valList = {}
  
    const utilsList = {
      'project-responsibility-A2': 'No, I plan to ask my landlord to take full responsibility for my project',
    }
  
    commonFunctionsMock(varList, 'Error', utilsList, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-confirmation`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Details submitted')
    expect(response.payload).toContain('VI')
    expect(response.payload).toContain('We have sent you a confirmation email with a record of your answers.')
    expect(response.payload).toContain('If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Investment Fund scheme.')
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('The RPA will contact you to invite you to submit a full application.')
    expect(response.payload).toContain('If your application is successful, you’ll be sent a funding agreement and can begin work on the project.')
    expect(response.payload).toContain('You must not start the project')
    expect(response.payload).toContain('Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.')
    expect(response.payload).toContain('Before you start the project, you can:')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
  })

  it('page loads successfully, with all the options - project-responsibility answer is No', async () => {
    varList.projectResponsibility = 'No, I plan to ask my landlord to take full responsibility for my project'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-confirmation`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Details submitted')
    expect(response.payload).toContain('We have sent you a confirmation email with a record of your answers.')
    expect(response.payload).toContain('If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Investment Fund scheme.')
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('The RPA will contact you to invite you to submit a full application.')
    expect(response.payload).toContain('If your application is successful, you’ll be sent a funding agreement and can begin work on the project.')
    expect(response.payload).toContain('You must not start the project')
    expect(response.payload).toContain('Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.')
    expect(response.payload).toContain('Before you start the project, you can:')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
    expect(response.payload).toContain('If you want your landlord to underwrite your project, you should agree this with them before you begin your full application. Your landlord will need to complete a form at full application. This will confirm that they agree to take over your project, including conditions in your Grant Funding Agreement, if your tenancy ends.')
  })
})
