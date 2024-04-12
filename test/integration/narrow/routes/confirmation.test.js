const { crumbToken } = require('./test-helper')

const senders = require('../../../../app/messaging/senders')
const { commonFunctionsMock } = require('../../../session-mock')

describe('confirm page', () => {
  const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue', projectResponsibility: '' }
  let valList = {}

  const utilsList = {
    'project-responsibility-A2': 'No, I plan to ask my landlord to take full responsibility for my project',
  }

  commonFunctionsMock(varList, 'Error', utilsList, valList)

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`,
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
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('You must not start the project')
    expect(response.payload).toContain('Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
    expect(response.payload).toContain('The RPA will contact you when the full application period opens. They will tell you if your project scored well enough to get the full application form.')
    expect(response.payload).toContain('If you submit an application, the RPA will assess it against other projects and value for money. You will not automatically get a grant. The grant is expected to be highly competitive and you are competing against other projects.')
    expect(response.payload).toContain('If your application is successful, you’ll be sent a funding agreement and can begin work on the project.')
  })

  it('page loads successfully, with all the options - project-responsibility answer is No', async () => {
    varList.projectResponsibility = 'No, I plan to ask my landlord to take full responsibility for my project'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`,
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
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('You must not start the project')
    expect(response.payload).toContain('Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
    expect(response.payload).toContain('The RPA will contact you when the full application period opens. They will tell you if your project scored well enough to get the full application form.')
    expect(response.payload).toContain('If you submit an application, the RPA will assess it against other projects and value for money. You will not automatically get a grant. The grant is expected to be highly competitive and you are competing against other projects.')
    expect(response.payload).toContain('If your application is successful, you’ll be sent a funding agreement and can begin work on the project.')
    expect(response.payload).toContain('If you want your landlord to underwrite your project, you should agree this with them before you begin your full application. Your landlord will need to complete a form at full application. This will confirm that they agree to take over your project, including conditions in your Grant Funding Agreement, if your tenancy ends.')
  })
})
