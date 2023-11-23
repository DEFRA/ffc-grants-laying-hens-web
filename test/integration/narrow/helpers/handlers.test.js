const data = require('../../../../app/helpers/desirability-score.json')
const scoreData = require('../../../data/score-data')

describe('Get & Post Handlers', () => {
  const newSender = require('../../../../app/messaging/application')
  const createMsg = require('../../../../app/messaging/create-msg')

  const getUserScoreSpy = jest.spyOn(newSender, 'getUserScore').mockImplementation(() => {
    Promise.resolve(scoreData)
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
    planningPermission: 'some fake value',
    gridReference: 'grid-ref-num',
    businessDetails: 'fake business',
    applying: true,
    SolarPVCost: 12345
  }

  jest.mock('../../../../app/helpers/page-guard', () => ({
    guardPage: (a, b, c) => false
  }))

  jest.mock('../../../../app/helpers/urls', () => ({
    getUrl: (a, b, c, d) => 'mock-url'
  }))

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))

  let question
  let mockH
  let mockRequest

  const { getHandler, createModel } = require('../../../../app/helpers/handlers')

  test('will redirect to start page if planning permission evidence is missing', async () => {
    question = {
      url: 'planning-permission-summary',
      title: 'mock-title'
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/upgrading-calf-housing/start')
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
    expect(mockH.redirect).toHaveBeenCalledWith('/upgrading-calf-housing/start')
  })

  // mock userScore function in handler.js
  describe('it handles the score results page: ', () => {
    mockRequest = { yar: { id: 2 }, route: { path: 'score' }, info: { host: 'hosty-host-host' } }
    test('Average score - environmental impact', async () => {
      scoreData.desirability.overallRating.band = 'Average'

      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: Average', JSON.stringify(scoreData))
        return scoreData
      })

      await getHandler(question)(mockRequest, mockH)
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreData.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'might',
        scoreData: scoreData,
        questions: scoreData.desirability.questions
      })
      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
		  expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Strong score - environmental impact', async () => {
      scoreData.desirability.overallRating.band = 'Strong'
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: stroong', JSON.stringify(scoreData))
        return scoreData
      })

      await getHandler(question)(mockRequest, mockH)
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreData.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is likely to',
        scoreData: scoreData,
        questions: scoreData.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
		  expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Default score - environmental impact', async () => {
      scoreData.desirability.overallRating.band = 'AAAARRRGGHH!!!'
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        return scoreData
      })

      await getHandler(question)(mockRequest, mockH)
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreData.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is unlikely to',
        scoreData: scoreData,
        questions: scoreData.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
		  expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })
  })

  test('Average score - rainwater', async () => {
    scoreData.desirability.overallRating.band = 'Average'
    varList.SolarPVCost = null

    question = {
      url: 'score',
      title: 'mock-title',
      backUrl: 'test-back-link'
    }
    mockH = { view: jest.fn() }

    jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
      console.log('Spy: Average', JSON.stringify(scoreData))
      return scoreData
    })

    await getHandler(question)(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalledWith('score', {
      titleText: scoreData.desirability.overallRating.band,
      backLink: 'test-back-link',
      formActionPage: 'score',
      scoreChance: 'might',
      scoreData: scoreData,
      questions: scoreData.desirability.questions
    })
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
  })

  test('Strong score - rainwater', async () => {
    scoreData.desirability.overallRating.band = 'Strong'
    scoreData.desirability.questions[4].answers[0].input[0].key = 'environmental-impact-A3'
    scoreData.desirability.questions[4].answers[0].input[0].value = 'None of the above'

    varList.SolarPVCost = null

    question = {
      url: 'score',
      title: 'mock-title',
      backUrl: 'test-back-link'
    }
    mockH = { view: jest.fn() }

    jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
      console.log('Spy: stroong', JSON.stringify(scoreData))
      return scoreData
    })

    await getHandler(question)(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalledWith('score', {
      titleText: scoreData.desirability.overallRating.band,
      backLink: 'test-back-link',
      formActionPage: 'score',
      scoreChance: 'is likely to',
      scoreData: scoreData,
      questions: scoreData.desirability.questions
    })

    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
  })

  test('Default score - rainwater', async () => {
    scoreData.desirability.overallRating.band = 'AAAARRRGGHH!!!'

    varList.SolarPVCost = null

    question = {
      url: 'score',
      title: 'mock-title',
      backUrl: 'test-back-link'
    }
    mockH = { view: jest.fn() }

    jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
      console.log('Spy: weakkk', JSON.stringify(scoreData))
      return scoreData
    })

    await getHandler(question)(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalledWith('score', {
      titleText: scoreData.desirability.overallRating.band,
      backLink: 'test-back-link',
      formActionPage: 'score',
      scoreChance: 'is unlikely to',
      scoreData: scoreData,
      questions: scoreData.desirability.questions
    })

    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
  })

  describe('Create Model', () => {
    test('it creates a model!', () => {
      const res = createModel(data, 'test-back-link', 'score')
      expect(res).toEqual({
        ...data,
        formActionPage: 'score',
        backLink: 'test-back-link'
      })
    })
  })
})
