const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')
const scoreData = require('../../../data/score-data-hen')
const { commonFunctionsMock } = require('../../../session-mock')

let varList
ALL_QUESTIONS.forEach(question => {
  if (question.preValidationKeys) {
    varList = question.preValidationKeys.map(m => {
      return { m: 'someValue' }
    })
  }
})

commonFunctionsMock(varList, undefined)

const newSender = require('../../../../app/messaging/application')
const createMsg = require('../../../../app/messaging/create-msg')
const getDesirabilityAnswersSpy = jest.spyOn(createMsg, 'getDesirabilityAnswers').mockImplementation(() => {
  return {
    test: 'test'
  };
})
const getUserScoringSpy = jest.spyOn(newSender, 'getUserScore').mockImplementation(() => {
  Promise.resolve(scoreData);
})


describe('All default GET routes', () => {
  beforeEach(async () => {
		jest.mock('../../../../app/messaging')
		jest.mock('../../../../app/messaging/senders')
		jest.mock('ffc-messaging')
	})
	afterEach(async () => {
		jest.clearAllMocks()
	})

  ALL_QUESTIONS.forEach(question => {
    varList.consentMain = 'Hello'

    it(`should load ${question.key} page successfully`, async () => {
      // for score page only
      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        return scoreData
      })

      const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/${question.url}`
      }
      const response = await global.__SERVER__.inject(options)
      console.log(response.headers.location)
      expect(response.statusCode).toBe(200)
    })
  })
})
