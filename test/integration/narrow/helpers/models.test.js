const { allAnswersSelected, getQuestionByKey } = require('ffc-grants-common-functionality').utils

jest.mock('../../../../app/helpers/urls')
const { getUrl } = require('../../../../app/helpers/urls')

jest.mock('ffc-grants-common-functionality')
const { getYarValue } = require('ffc-grants-common-functionality').session

describe('Models', () => {
  const question = {
    type: 'mock_type',
    backUrl: 'mock_back_url',
    key: 'mock_key',
    answers: [{
      value: 'mock_answer_value',
      hint: 'hint',
      text: 'answer_text'
    }],
    backUrlObject: {
      dependentQuestionYarKey: 'tenancyLength',
      dependentAnswerKeysArray: ['tenancy-length-A1'],
      urlOptions: {
        thenUrl: 'tenancy-length',
        elseUrl: 'tenancy-length-condition',
        nonDependentUrl: 'tenancy'
      }
    },
    sidebar: {
      values: [{
        heading: 'Eligibility',
        content: [{
          para: `This grant is for pig, beef or dairy farmers.
          
          Poultry, arable-only, contractors and horticultural growers are not currently eligible.`
        }]
      }]
    },
    score: '123',
    warning: {
      text: 'Other types of business may be supported in future schemes',
      iconFallbackText: 'Warning'
    }
  }

  const { getModel } = require('../../../../app/helpers/models')

  test('inspect getModel() - full value', () => {
    expect(getModel([], question, {})).toEqual({
      type: 'mock_type',
      key: 'mock_key',
      title: undefined,
      backUrl: undefined,
      hint: undefined,
      items: undefined,
      sideBarText: {
        values: [
          expect.objectContaining({ heading: 'Eligibility' })
        ]
      },
      warning: {
        text: 'Other types of business may be supported in future schemes',
        iconFallbackText: 'Warning'
      },
      reachedCheckDetails: false,
      reachedEvidenceSummary: false,
      diaplaySecondryBtn: false
    })
  })

  test('inspect getModel().title', () => {
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: undefined
      })
    )

    question.label = { text: 'mock_label_text' }
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: 'mock_label_text'
      })
    )

    question.title = 'mock_title'
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: 'mock_title'
      })
    )
  })

  test('inspect getModel().backUrl', () => { // TODO: Refactor this
    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce(undefined)
    getYarValue.mockReturnValueOnce('mock-value')

    getUrl.mockReturnValueOnce('remaining-costs')
    getUrl.mockReturnValueOnce('tenancy')
    getUrl.mockReturnValueOnce('tenancy')

    expect(getModel([], question, {}).backUrl).toBeNull()
    expect(getModel([], question, {}).backUrl).toEqual('tenancy')
  })

  test('inspect getModel().warningDetails', () => {
    question.warningCondition = {
      dependentWarningQuestionKey: 'mock_key',
      dependentWarningAnswerKeysArray: {},
      warning: {
        text: 'mock_warning_text',
        iconFallbackText: 'mock_warning'
      }
    }

    allAnswersSelected.mockReturnValueOnce(true)

    expect(getModel([], question, {}).warning).toEqual({
      text: 'mock_warning_text',
      iconFallbackText: 'mock_warning'
    })
  })

  test('Test sidebar in getModel when no yar key value', () => {
    const questionForSidebar = {
      type: 'mock_type',
      backUrl: 'mock_back_url',
      key: 'mock_key',
      answers: [{
        value: 'mock_answer_value',
        hint: 'hint',
        text: 'answer_text'
      }],
      backUrlObject: {
        dependentQuestionYarKey: 'tenancyLength',
        dependentAnswerKeysArray: ['tenancy-length-A1'],
        urlOptions: {
          thenUrl: 'tenancy-length',
          elseUrl: 'tenancy-length-condition',
          nonDependentUrl: 'tenancy'
        }
      },
      sidebar: {
        mainHeading: 'Your project items',
        values: [
          {
            heading: 'Store',
            content: [{
              para: '',
              items: [],
              dependentAnswerExceptThese: []
            }]
          },
          {
            heading: 'Cover',
            content: [{
              para: '',
              items: [],
              dependentAnswerExceptThese: []
            }]
          }],
        prefixSufix: [{
          linkedPrefix: 'Increase: ',
          linkedSufix: 'm³'
        }],
        linkedQuestionkey: ['serviceable-capacity-increase-additional'],
        dependentQuestionKeys: ['storage-type', 'cover-type']
      },
      score: '123',
      warning: {
        text: 'Other types of business may be supported in future schemes',
        iconFallbackText: 'Warning'
      }
    }

    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce('mock-value')
    getYarValue.mockReturnValueOnce(undefined)
    getYarValue.mockReturnValueOnce(undefined)

    expect(getModel([], questionForSidebar, {})).toEqual({
      type: 'mock_type',
      key: 'mock_key',
      title: undefined,
      backUrl: undefined,
      hint: undefined,
      items: undefined,
      sideBarText: {
        dependentQuestionKeys: [
          'storage-type', 'cover-type'
        ],
        linkedQuestionkey: ['serviceable-capacity-increase-additional'],
        mainHeading: 'Your project items',
        prefixSufix: [
          {
            linkedPrefix: 'Increase: ',
            linkedSufix: 'm³'
          }
        ],
        values: [
          {
            content: [{
              dependentAnswerExceptThese: [],
              items: [],
              para: ''
            }],
            heading: 'Store'
          },
          {
            content: [
              {
                dependentAnswerExceptThese: [],
                items: [],
                para: ''
              }

            ],
            heading: 'Cover'
          }
        ]
      },
      warning: {
        text: 'Other types of business may be supported in future schemes',
        iconFallbackText: 'Warning'
      },
      reachedCheckDetails: false,
      reachedEvidenceSummary: false,
      diaplaySecondryBtn: undefined
    })
  })

  // test('inspect getModel().sidebarText', () => {
  //   let dict = {}
  //   session.getYarValue.mockImplementation((req, key) => (dict[key]))

  //   expect(getModel([], question, {}).sideBarText.values[0].content[0].items).toBeUndefined()

  //   dict = {
  //     ...dict,
  //     projectItems: [
  //       'Constructing or improving buildings for processing',
  //       'Processing equipment or machinery',
  //       'Retail facilities'
  //     ],
  //     environmentalImpact: [
  //       'Renewable energy',
  //       'Energy efficiency',
  //       'Water efficiency',
  //       'Waste efficiency',
  //       'Sustainable packaging measures',
  //       'Reduce harmful emissions or pollutants'
  //     ]
  //   }

  //   question.sidebar = {
  //     values: [
  //       {
  //         heading: 'Selected items',
  //         content: [{
  //           para: '',
  //           items: [],
  //           dependentAnswerExceptThese: ['project-items-A1', 'environmental-impact-A1', 'environmental-impact-A2']
  //         }]
  //       }
  //     ],
  //     dependentYarKeys: ['projectItems', 'environmentalImpact'],
  //     dependentQuestionKeys: ['standard-costs', 'environmental-impact']
  //   }

  //   expect(getModel([], question, {}).sideBarText.values[0].content[0].items).toEqual([
  //     'Processing equipment or machinery',
  //     'Retail facilities',
  //     'Water efficiency',
  //     'Waste efficiency',
  //     'Sustainable packaging measures',
  //     'Reduce harmful emissions or pollutants'
  //   ])

  //   question.sidebar = {
  //     values: [
  //       {
  //         heading: 'Selected items',
  //         content: [{
  //           para: '',
  //           items: [],
  //           dependentAnswerOnlyThese: ['project-items-A1', 'environmental-impact-A1', 'environmental-impact-A2']
  //         }]
  //       }
  //     ],
  //     dependentYarKeys: ['projectItems', 'environmentalImpact'],
  //     dependentQuestionKeys: ['standard-costs', 'environmental-impact']
  //   }

  //   expect(getModel([], question, {}).sideBarText.values[0].content[0].items).toEqual([
  //     'Constructing or improving buildings for processing'
  //   ])

  //   expect(getModel([], question, {}).sideBarText.values[1].content[0].items).toEqual([
  //     'Renewable energy',
  //     'Energy efficiency'
  //   ])
  // })
})
