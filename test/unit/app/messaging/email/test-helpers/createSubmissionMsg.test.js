const agentSubmission = require('./submission-agent.json')
const farmerSubmission = require('./submission-farmer.json')
const desirabilityScoreHen = require('../../../../app/messaging/scoring/desirability-score-hen.json')
const desirabilityScorePullet = require('../../../../app/messaging/scoring/desirability-score-pullet.json')
const { commonFunctionsMock } = require('./../../../../../session-mock')

describe('Create submission message', () => {
  const mockPassword = 'mock-pwd'

  const varList = {}
  const utilsList = {
    'poultry-type-A1': 'hen',
    'poultry-type-A2': 'pullet',
    'project-type-A1': 'Adding a veranda only to the existing building',
    'solar-PV-system-A1': 'Yes',
    'solar-PV-system-A2': 'No',
    'rearing-aviary-system-A1': 'Yes',
    'step-up-system-A1': 'Yes',
    'current-system-A1': 'Colony cage',
    'current-system-A2': 'Combi-cage',
  }
  commonFunctionsMock(varList, undefined, utilsList, undefined)


  jest.mock('../../../../../../app/messaging/email/config/email', () => ({
    notifyTemplate: 'mock-template'
  }))
  jest.mock('../../../../../../app/messaging/email/config/spreadsheet', () => {
    return {
      hideEmptyRows: true,
      protectEnabled: true,
      sendEmailToRpa: true,
      rpaEmail: 'FTF@rpa.gov.uk',
      protectPassword: mockPassword
    }
  })

  const createMsg = require('../../../../../../app/messaging/email/create-submission-msg')

  beforeEach(() => {
    jest.resetModules()
  })

  test('Farmer submission generates correct message payload', () => {
    const msg = createMsg(farmerSubmission, desirabilityScoreHen)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
    expect(msg.agentEmail).toBe(null)
  })

  test('Farmer submission generates message payload without RPA email when config is Flase', () => {
    jest.mock('../../../../../../app/messaging/email/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))

    farmerSubmission.applicantType = ['Laying hens (including pullets)']

    const msg = createMsg(farmerSubmission, desirabilityScoreHen)
    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBeFalsy
    expect(msg.agentEmail).toBe(null)
  })
  test('Email part of message should have correct properties', () => {
    farmerSubmission.applicantType = 'Laying hens (including pullets)'
    
    const msg = createMsg(farmerSubmission, desirabilityScoreHen)

    expect(msg.applicantEmail).toHaveProperty('notifyTemplate')
    expect(msg.applicantEmail).toHaveProperty('emailAddress')
    expect(msg.applicantEmail).toHaveProperty('details')
    expect(msg.applicantEmail.details).toHaveProperty(
      'projectType', 'inEngland', 'applicantType', 'legalStatus', 'planningPermission',
      'firstName', 'lastName', 'referenceNumber', 'overallRating',
      'location', 'landOwnership', 'tenancyAgreement', 'project',
      'technology', 'itemsCost', 'potentialFunding', 'remainingCost',
      'projectStarted', 'projectName', 'businessName',
      'farmerName', 'farmerSurname', 'agentName', 'agentSurname', 'farmerEmail', 'agentEmail',
      'contactConsent', 'scoreDate', 'projectCost', 'scoreDate', 'environmentalDataType', 'birdDataType',
      'renewableEnergy', 'pollutionMitigation', 'buildingBiosecurity', 'easyGripPerches', 'naturalLighting',
      'consistentHousing'
    )
  })
  test('Under 10 employees results in micro business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 1
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScoreHen)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Micro')
  })

  test('Under 50 employees results in small business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 10
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScoreHen)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Small')
  })

  test('Under 250 employees results in medium business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 50
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScoreHen)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Medium')
  })

  test('Over 250 employees results in large business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 250
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScoreHen)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Large')
  })

  test('Agent submission generates correct message payload', () => {
    jest.mock('../../../../../../app/messaging/email/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: true,
      sendEmailToRpa: true,
      protectPassword: mockPassword
    }))
    const msg = createMsg(agentSubmission, desirabilityScorePullet)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.agentEmail.emailAddress).toBe(agentSubmission.agentsDetails.emailAddress)
    expect(msg.applicantEmail.emailAddress).toBe(agentSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
  })

  test('Spreadsheet part of message should have correct properties', () => {
    agentSubmission.environmentalImpact = 'None of the above'
    const msg = createMsg(agentSubmission, desirabilityScorePullet)

    expect(msg.spreadsheet).toHaveProperty('filename')
    expect(msg.spreadsheet).toHaveProperty('uploadLocation')
    expect(msg.spreadsheet).toHaveProperty('worksheets')
    expect(msg.spreadsheet.worksheets.length).toBe(1)
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('title')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('hideEmptyRows')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('defaultColumnWidth')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('protectPassword')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('rows')
    expect(msg.spreadsheet.worksheets[0].rows.length).toBe(67)
})

  test('Protect password property should not be set if config is false', () => {
    jest.mock('../../../../../../app/messaging/email/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))
    const createSubmissionMsg = require('../../../../../../app/messaging/email/create-submission-msg')
    const msg = createSubmissionMsg(agentSubmission, desirabilityScorePullet)
    expect(msg.spreadsheet.worksheets[0]).not.toHaveProperty('protectPassword')
  })

  test('getscorechance function', () => {
    let msg = createMsg(farmerSubmission, desirabilityScoreHen, 'strong')
    expect(msg.getScoreChance).toBe('seems likely to')

    msg = createMsg(farmerSubmission, desirabilityScoreHen)
    expect(msg.getScoreChance).toBe('seems unlikely to')
  })
  
})
