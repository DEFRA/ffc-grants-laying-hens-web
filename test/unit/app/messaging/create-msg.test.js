describe('create-msg', () => {

  jest.mock('ffc-grants-common-functionality', () => ({
    session: {
      getYarValue: jest.fn((request, key) => key),
    },
    regex: {
      PROJECT_COST_REGEX: /^[1-9]\d*$/
    },
    counties: {
      LIST_COUNTIES: ['Derbyshire', 'Leicestershire', 'Lincolnshire', 'Northamptonshire', 'Nottinghamshire', 'Rutland']
    },
    answerOptions: {
      getOptions: (data, question, conditionalHTML, request) => null,
      setOptionsLabel: (data, answers, conditonalHTML) => null
    },
    utils: {
      getQuestionAnswer: (questionKey, answerKey, allQuestions) => null,
    },
    errorHelpers: {
      validateAnswerField: (request, key, regex, error) => null,
      checkInputError: (request, key, error) => null,
    },
    pageGuard: {
      guardPage: (request, h, page, next) => null
    }
  }));
  const { getYarValue } = require('ffc-grants-common-functionality').session

  const { getDesirabilityAnswers, getAllDetails } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers()', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      poultryType: 'hello',
      currentSystem: 'hello',
      currentMultiTierSystem: 'hello',
      rampConnection: 'hello',
      maximumTierHeight: 'hello',
      threeTiers: 'hello',
      henMultiTier: 'hello',
      // pulletMultiTier: 'hello',
      naturalLight: 'hello',
      // darkBrooders: 'hello',
      easyGripPerches: 'hello',
      buildingBiosecurity: ['hello'],
      pollutionMitigation: ['hello'],
      // pulletVerandaFeatures: 'hello'
      renewableEnergy: ['hello'],
      birdDataType: ['hello'],
      environmentalDataType: ['hello']
    }
    expect(getDesirabilityAnswers({})).toEqual({
      poultryType: 'hello',
      currentSystem: 'hello',
      currentMultiTierSystem: 'hello',
      rampConnection: 'hello',
      maximumTierHeight: 'hello',
      threeTiers: 'hello',
      henMultiTier: 'hello',
      // pulletMultiTier: 'hello',
      naturalLight: 'hello',
      // darkBrooders: 'hello',
      easyGripPerches: 'hello',
      buildingBiosecurity: ['hello'],
      pollutionMitigation: ['hello'],
      // pulletVerandaFeatures: 'hello'
      renewableEnergy: ['hello'],
      birdDataType: ['hello'],
      environmentalDataType: ['hello']
    })

    dict = {
      poultryType: 'hello',
      currentSystem: 'hello',
      currentMultiTierSystem: null,
      rampConnection: 'hello',
      maximumTierHeight: 'hello',
      threeTiers: 'hello',
      henMultiTier: null,
      // pulletMultiTier: null,
      naturalLight: 'hello',
      // darkBrooders: null,
      easyGripPerches: 'hello',
      buildingBiosecurity: ['hello'],
      pollutionMitigation: ['hello'],
      // pulletVerandaFeatures: null
      renewableEnergy: ['hello'],
      birdDataType: ['hello'],
      environmentalDataType: ['hello']
    }
    expect(getDesirabilityAnswers({})).toEqual({
      poultryType: 'hello',
      currentSystem: 'hello',
      currentMultiTierSystem: null,
      rampConnection: 'hello',
      maximumTierHeight: 'hello',
      threeTiers: 'hello',
      henMultiTier: null,
      // pulletMultiTier: null,
      naturalLight: 'hello',
      // darkBrooders: null,
      easyGripPerches: 'hello',
      buildingBiosecurity: ['hello'],
      pollutionMitigation: ['hello'],
      // pulletVerandaFeatures: null
      renewableEnergy: ['hello'],
      birdDataType: ['hello'],
      environmentalDataType: ['hello']
    })

    dict = {
      poultryType: null,
      currentSystem: null,
      currentMultiTierSystem: null,
      rampConnection: null,
      maximumTierHeight: null,
      threeTiers: null,
      henMultiTier: null,
      // pulletMultiTier: null,
      naturalLight: null,
      // darkBrooders: null,
      easyGripPerches: null,
      buildingBiosecurity: null,
      pollutionMitigation: null,
      // pulletVerandaFeatures: null
      renewableEnergy: null,
      birdDataType: null,
      environmentalDataType: null
    }

    expect(getDesirabilityAnswers({})).toEqual(null)


  })

  test('getAllDetails', () => {
    const request = {};
    const confirmationId = '123';

    const result = getAllDetails(request, confirmationId);


    expect(result.confirmationId).toEqual('123');

  })
})
