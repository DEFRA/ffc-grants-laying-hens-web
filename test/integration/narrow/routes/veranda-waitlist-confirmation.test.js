const { crumbToken } = require('./test-helper')

const senders = require('../../../../app/messaging/senders')
const { commonFunctionsMock } = require('../../../session-mock')
process.env.VERANDA_FUNDING_CAP_REACHED = 'true'
describe('varanda waitlist confirmation page', () => {
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
      url: `${global.__URLPREFIX__}/veranda-waitlist-confirmation`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Details submitted')
    expect(response.payload).toContain('VO')
    expect(response.payload).toContain('You have registered your interest for veranda-only grant funding. We have sent you a confirmation email with a record of your answers.')
    expect(response.payload).toContain('If you do not get an email within 72 hours, contact the RPA helpline and follow the options for the Farming Investment Fund scheme.')
    expect(response.payload).toContain('RPA helpline')
    expect(response.payload).toContain('Telephone')
    expect(response.payload).toContain('<p>Telephone: 0300 0200 301</p>')
    expect(response.payload).toContain('Monday to Friday, 9am to 5pm (except public holidays)')
    expect(response.payload).toContain('Find out about call charges (opens in a new tab)')
    expect(response.payload).toContain('Email')
    expect(response.payload).toContain('FTF@rpa.gov.uk')
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('If there is grant funding available, the RPA will contact you to invite you to submit a full application. If there is no grant funding available, the RPA aim to contact you within 20 working days of this service closing.')
    expect(response.payload).toContain('If your application is successful, you’ll be sent a funding agreement and can begin work on the project.')
    expect(response.payload).toContain('You must not start the project.')
    expect(response.payload).toContain('<div class=\"govuk-body\"><p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p>')
    expect(response.payload).toContain('Before you start the project, you can:')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
    expect(response.payload).toContain('What do you think of this service? (opens in a new tab)')
  })

  it('page loads successfully, with all the options - project-responsibility answer is No', async () => {
    varList.projectResponsibility = 'No, I plan to ask my landlord to take full responsibility for my project'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/veranda-waitlist-confirmation`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Details submitted')
    expect(response.payload).toContain('VO')
    expect(response.payload).toContain('You have registered your interest for veranda-only grant funding. We have sent you a confirmation email with a record of your answers.')
    expect(response.payload).toContain('If you do not get an email within 72 hours, contact the RPA helpline and follow the options for the Farming Investment Fund scheme.')
    expect(response.payload).toContain('RPA helpline')
    expect(response.payload).toContain('Telephone')
    expect(response.payload).toContain('<p>Telephone: 0300 0200 301</p>')
    expect(response.payload).toContain('Monday to Friday, 9am to 5pm (except public holidays)')
    expect(response.payload).toContain('Find out about call charges (opens in a new tab)')
    expect(response.payload).toContain('Email')
    expect(response.payload).toContain('FTF@rpa.gov.uk')
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('If there is grant funding available, the RPA will contact you to invite you to submit a full application. If there is no grant funding available, the RPA aim to contact you within 20 working days of this service closing.')
    expect(response.payload).toContain('If your application is successful, you’ll be sent a funding agreement and can begin work on the project.')
    expect(response.payload).toContain('You must not start the project.')
    expect(response.payload).toContain('<div class=\"govuk-body\"><p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p>')
    expect(response.payload).toContain('Before you start the project, you can:')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
    expect(response.payload).toContain('If you want your landlord to underwrite your project, you should agree this with them before you begin your full application. Your landlord will need to complete a form at full application. This will confirm that they agree to take over your project, including conditions in your Grant Funding Agreement, if your tenancy ends.')
    expect(response.payload).toContain('What do you think of this service? (opens in a new tab)')
  })
})
