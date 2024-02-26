describe('urls.js', () => {
  jest.mock('ffc-grants-common-functionality')

  const { session } = require('ffc-grants-common-functionality') 

  const { getUrl } = require('../../../../app/helpers/urls')

  test('getUrl()', () => {
    let dict = {}
    session.getYarValue.mockImplementation((req, key) => (dict[key]))

    let urlObject = null
    let secBtn = 'Back to score'
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('/laying-hens/score')

    secBtn = ''
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('mock-url')

    urlObject = {
      dependentQuestionYarKey: 'dependentQuestionYarKey',
      dependentAnswerKeysArray: 'dependentAnswerKeysArray',
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl',
        nonDependentUrl: 'nonDependentUrl'
      }
    }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('nonDependentUrl')

    dict = { dependentQuestionYarKey: 'dp-yarKey' }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('elseUrl')
  })
})
