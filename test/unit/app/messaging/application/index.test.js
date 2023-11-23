const { getUserScore } = require('../../../../../app/messaging/application')
const { scoreRequestQueue, scoreResponseQueue, fetchScoreRequestMsgType } = require('../../../../../app/config/messaging.js')

jest.mock('../../../../../app/messaging')
const { receiveMessage, sendMessage } = require('../../../../../app/messaging')

describe('application messaging tests', () => {
  const sessionId = 'a-session-id'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('getApplication sends and receives message', async () => {
    const receiveMessageRes = { id: 1 }
    receiveMessage.mockResolvedValue(receiveMessageRes)

    const message = await getUserScore({}, sessionId)

    expect(message).toEqual(receiveMessageRes)
    expect(receiveMessage).toHaveBeenCalledTimes(1)
    expect(receiveMessage).toHaveBeenCalledWith(sessionId, scoreResponseQueue)
    expect(sendMessage).toHaveBeenCalledTimes(1)
    expect(sendMessage).toHaveBeenCalledWith({}, fetchScoreRequestMsgType, scoreRequestQueue, { sessionId })
  })
})
