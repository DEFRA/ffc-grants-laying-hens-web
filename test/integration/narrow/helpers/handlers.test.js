const { ALL_QUESTIONS } = require('.scoreDat./../../../app/config/question-bank')
const dataHen = require('./../../../unit/app/messaging/scoring/desirability-score-hen.json')
const scoreDataHen = require('../../../data/score-data-hen')
const scoreDataPullet = require('../../../data/score-data-pullet')

describe('Get & Post Handlers', () => {
  const newSender = require('../../../../app/messaging/application')
  const createMsg = require('../../../../app/messaging/create-msg')

  const getUserScoreSpy = jest.spyOn(newSender, 'getUserScore').mockImplementation(() => {
    Promise.resolve(scoreDataHen)
  })

  const getDesirabilityAnswersSpy = jest.spyOn(createMsg, 'getDesirabilityAnswers').mockImplementation(() => {
    return {
      test: 'test'
    }
  })

  beforeEach(async () => {
    jest.mock('../../../../app/messaging')
    jest.mock('../../../../app/messaging/senders')
    jest.mock('ffc-messaging')
  })
  afterEach(async () => {
    jest.clearAllMocks()
  })

  const varList = {
    poultryType: 'hen',
    currentMultiTierSystem: 'Yes'
  }

  const utilsList = {
    'poultry-type-A1': 'hen',
    'poultry-type-A2': 'pullet',
    'current-multi-tier-system-A1': 'Yes',
    'current-multi-tier-system-A2': 'No',
  }

  jest.mock('../../../../app/helpers/urls', () => ({
    getUrl: (a, b, c, d) => 'mock-url'
  }))

  jest.mock('ffc-grants-common-functionality', () => ({
    session: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return null
      }
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
      getQuestionByKey: (questionKey, allQuestions) => {
        return {
          yarKey: 'testYarKey',
          answers: [
            {
              key: 'testKey',
              value: 'testValue'
            }
          ]
        }
      },
      allAnswersSelected: (questionKey, allQuestions) => null,
      getQuestionAnswer: (questionKey, answerKey, allQuestions) => {
        if (Object.keys(utilsList).includes(answerKey)) return utilsList[answerKey]
        else return null
      }
    },
    // pageGuard mock here (maybe errorHelpers too if needed)
    pageGuard: {
      guardPage: (request, guardData, startPageUrl, serviceEndDate, serviceEndTime, ALL_QUESTIONS) => false

    },
    errorHelpers: {
      validateAnswerField: (validate, isconditionalAnswer, payload, yarKey, ALL_QUESTIONS) => null,
      checkInputError: (validate, isconditionalAnswer, payload, yarKey, ALL_QUESTIONS) => null
    }

  }))

  let question
  let mockH
  let mockRequest

  const { getHandler, createModel } = require('../../../../app/helpers/handlers')

  xtest('will redirect to start page if planning permission evidence is missing', async () => {
    question = {
      url: 'planning-permission-summary',
      title: 'mock-title'
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/laying-hens/start')
  })

  test('is eligible if calculated grant = min grant - whether grant is capped or not', async () => { // TODO: I don't understand this test is trying to check for
    question = {
      url: 'mock-url',
      title: 'mock-title',
      maybeEligible: true,
      maybeEligibleContent: { reference: 'mock-reference' }
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/laying-hens/start')
  })

  // mock userScore function in handler.js
  describe('it handles the score results page: ', () => {
    mockRequest = { yar: { id: 2 }, route: { path: 'score' }, info: { host: 'hosty-host-host' } }
    test('Average score - hen', async () => {
      scoreDataHen.desirability.overallRating.band = 'Average'

      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link',
        sidebar: {
          values: [{
            heading: 'Eligibility',
            content: [{
              para: 'You must:',
              items: ['be the registered keeper of at least 1,000', 'have housed at least 1,000 {{_poultryType_}} on your farm in the last 6 months.']
            }]
          }]
        },
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: Average', JSON.stringify(scoreDataHen))
        return scoreDataHen
      })

      await getHandler(question)(mockRequest, mockH)
      scoreDataHen.desirability.questions.shift()
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreDataHen.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'might',
        scoreData: scoreDataHen,
        questions: scoreDataHen.desirability.questions
      })
      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
      expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Strong score - hen', async () => {
      scoreDataHen.desirability.overallRating.band = 'Strong'
      scoreDataHen.desirability.questions[5].answers[0].input[0].value = 'No'
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: stroong', JSON.stringify(scoreDataHen))
        return scoreDataHen
      })

      await getHandler(question)(mockRequest, mockH)
      scoreDataHen.desirability.questions.shift()

      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreDataHen.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is likely to',
        scoreData: scoreDataHen,
        questions: scoreDataHen.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
      expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Default score - hen', async () => {
      scoreDataHen.desirability.overallRating.band = 'AAAARRRGGHH!!!'
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        return scoreDataHen
      })

      await getHandler(question)(mockRequest, mockH)
      scoreDataHen.desirability.questions.shift()

      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreDataHen.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is unlikely to',
        scoreData: scoreDataHen,
        questions: scoreDataHen.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
      expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Average score - pullet', async () => {
      varList.poultryType = 'pullet'
      varList.currentMultiTierSystem = 'Yes'

      scoreDataPullet.desirability.overallRating.band = 'Average'

      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link',
        sidebar: {
          values: [{
            heading: 'Eligibility',
            content: [{
              para: 'You must:',
              items: ['be the registered keeper of at least 1,000', 'have housed at least 1,000 {{_poultryType_}} on your farm in the last 6 months.']
            }]
          }]
        },
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: Average', JSON.stringify(scoreDataPullet))
        return scoreDataPullet
      })

      await getHandler(question)(mockRequest, mockH)
      scoreDataPullet.desirability.questions.shift()
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreDataPullet.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'might',
        scoreData: scoreDataPullet,
        questions: scoreDataPullet.desirability.questions
      })
      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
      expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Strong score - pullet', async () => {
      scoreDataPullet.desirability.overallRating.band = 'Strong'
      scoreDataPullet.desirability.questions[5].answers[0].input[0].value = 'No'

      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: stroong', JSON.stringify(scoreDataPullet))
        return scoreDataPullet
      })

      await getHandler(question)(mockRequest, mockH)
      scoreDataPullet.desirability.questions.shift()

      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreDataPullet.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is likely to',
        scoreData: scoreDataPullet,
        questions: scoreDataPullet.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
      expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Default score - pullet', async () => {
      scoreDataPullet.desirability.overallRating.band = 'AAAARRRGGHH!!!'
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        return scoreDataPullet
      })

      await getHandler(question)(mockRequest, mockH)
      scoreDataPullet.desirability.questions.shift()

      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreDataPullet.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is unlikely to',
        scoreData: scoreDataPullet,
        questions: scoreDataPullet.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
      expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })
  
  })

  describe('Create Model', () => {
    test('it creates a model!', () => {
      const res = createModel(dataHen, 'test-back-link', 'score')
      expect(res).toEqual({
        ...dataHen,
        formActionPage: 'score',
        backLink: 'test-back-link'
      })
    })
  })
})
