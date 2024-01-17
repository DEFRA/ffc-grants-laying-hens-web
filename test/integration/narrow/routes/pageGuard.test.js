const createServer = require('../../../../app/server')
const { startPageUrl } = require('../../../../app/config/server')
const mockQuestionBank = require('./mockQuestionBank')

require('dotenv').config()

const varListTemplate = {
  projectSubject: 'Farm productivity project items',
  applicant: 'Farmer'
}
let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return undefined
  }
}
jest.mock('../../../../app/helpers/session', () => mockSession)
jest.mock('../../../../app/config/question-bank', () => mockQuestionBank)

describe('Page Guard', () => {
  const OLD_ENV = process.env
  let server

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    varList = { ...varListTemplate }

  })

  afterEach(() => {
    process.env = OLD_ENV
    server.stop()
    jest.clearAllMocks()

  })

  it('shoud redirect to start page if the site is decommissioned', async () => {
    process.env.SERVICE_END_DATE = '2021/02/17'
    process.env.SERVICE_END_TIME = '23:59:58'
    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('AND - should redirect to start page if no key found', async () => {

    varList.applicant = 'Farmer'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-location`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('AND - should load normal page if all keys found (1 item)', async () => {

    varList.applicant = 'Contractor'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-location`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Is your business in England?')
  })

  it('OR - should redirect to start page if no key found', async () => { 
    varList.projectSubject = 'random'
    varList.applicant = 'random'
    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('OR - should load normal page if any key found', async () => {

    varList.businessLocation = 'Yes'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('What is the legal status of the business?')
  })

  it('NOT - should redirect to start page if any key found', async () => {

    varList.legalStatus = 'None of the above'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/country`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('NOT - should load normal page if key not found', async () => {

    varList.legalStatus = 'asjhakh'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/country`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Is the planned project in England?')
  })


  it('should redirect to start page if the user skip journey question - old way', async () => {
    varList.projectSubject = null
    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant`
    }

    const response = await server.inject(getOptions)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(startPageUrl)
  })

  it('should correct page if user does not skip - old way', async () => {
    varList.projectSubject = 'Solar project items'
    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant`
    }

    const response = await server.inject(getOptions)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Who are you?')
  })

  it('NOT - should load start page in preValidationKeys is not answered', async () => {

    varList.applicant = null

    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/farmers-details`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('SPECIFICANDANY - should load start page if first parameter is not entered', async () => {

    varList.solarTechnologies = 'fake data'
    varList.solarOutput = 'Up to 50kW'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost-solar`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('SPECIFICANDANY - should load start page if first parameter is not entered', async () => {

    varList.solarTechnologies = null
    varList.solarOutput = null

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost-solar`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })


  it('SPECIFICANDANY - should load project cost solar page if first parameter is prevalidation answer and second parameter is any', async () => {

    varList.solarTechnologies = 'Solar PV panels'
    varList.solarOutput = 'Up to 50kW'
    varList.solarInstallation = 'On a rooftop'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost-solar`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('What is the total estimated cost of the solar project items?')
  })

  it('SPECIFICANDANY - should load project cost solar page if first parameter is not prevalidation answered and second parameter is not needed.', async () => {

    varList.solarTechnologies = 'An electrical grid connection'
    varList.solarOutput = null
    varList.solarInstallation = null

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost-solar`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('What is the total estimated cost of the solar project items?')
  })


  it('NOTOR - should load start page if first parameter or second preValidationAnswer is entered', async () => {

    varList.automaticEligibility = 'None of the above'
    varList.roboticEligibility = 'Yes'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-description`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('NOTOR - should load start page if first parameter or second is not entered', async () => {

    varList.automaticEligibility = null
    varList.roboticEligibility = null

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-description`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('NOTINCLUDES - should load start page if expected the preValidationAnswer is not entered', async () => {

    varList.solarTechnologies = 'An electrical grid connection'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-installation`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

  it('NOTINCLUDES - should load start page if the preValidationAnswer is not entered', async () => {

    varList.solarTechnologies = null

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-installation`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })

})