const {
  CHARS_MIN_10,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  SBI_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  ONLY_TEXT_REGEX,
  ONLY_DIGITS_REGEX,
  ADDRESS_REGEX,
  PROJECT_COST_REGEX,
  CHARS_MAX_25,
  STRUCTURE_ELIGIBLITY_REGEX,
  TWO_DP_NUMBER,
  ONLY_DIGITS_AND_DECIMAL_REGEX
} = require('../helpers/regex')

const {
  MIN_GRANT,
  MAX_GRANT,
  GRANT_PERCENTAGE
} = require('../helpers/grant-details')

const { LIST_COUNTIES } = require('../helpers/all-counties')

/**
 * ----------------------------------------------------------------
 * list of yarKeys not bound to an answer, calculated separately
 * -  calculatedGrant
 * -  remainingCost
 *
 * Mainly to replace the value of a previously stored input
 * Format: {{_VALUE_}}
 * eg: question.title: 'Can you pay £{{_storedYarKey_}}'
 * ----------------------------------------------------------------
 */

/**
 * ----------------------------------------------------------------
 * question type = single-answer, boolean ,input, multiinput, mullti-answer
 *
 *
 * ----------------------------------------------------------------
 */

/**
 * multi-input validation schema
 *
 *  type: 'multi-input',
    allFields: [
      {
        ...
        validate: [
          {
            type: 'NOT_EMPTY',
            error: 'Error message'
          },
          {
            type: 'REGEX',
            error: 'Error message',
            regex: SAVED_REGEX
          },
          {
            type: 'MIN_MAX',
            error: 'Error message',
            min: MINIMUM,
            max: MAXIMUM
          }
        ]
      }
    ]
 */

const questionBank = {
  grantScheme: {
    key: 'FFC002',
    name: 'Slurry Infrastructure'
  },
  sections: [
    {
      name: 'eligibility',
      title: 'Eligibility',
      questions: [
        {
          key: 'applicant-type',
          order: 10,
          title: 'What type of farmer are you?',
          pageTitle: '',
          ga: { journeyStart: true },
          url: 'applicant-type',
          baseUrl: 'applicant-type',
          backUrl: 'start',
          nextUrl: 'legal-status',
          hint: {
            text: 'Select all that apply'
          },
          ineligibleContent: {
            messageContent: 'This grant is only for dairy and beef (including calf rearing) farmers.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is only for dairy and beef (including calf rearing) farmers.'
              }]
            }]
          },
          fundingPriorities: 'Improve the environment',
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to you'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'applicant-type',
                answerKey: 'applicant-type-A10'
              }
            }
          ],
          answers: [
            {
              key: 'applicant-type-A1',
              value: 'Beef (including calf rearing)'
            },
            {
              key: 'applicant-type-A2',
              value: 'Dairy (including calf rearing)'
            },
            {
              key: 'applicant-type-A3',
              value: 'Pigs',
              notEligible: true
            },
            {
              key: 'applicant-type-A4',
              value: 'Sheep',
              notEligible: true
            },
            {
              key: 'applicant-type-A5',
              value: 'Laying hens',
              notEligible: true
            },
            {
              key: 'applicant-type-A6',
              value: 'Meat chickens',
              notEligible: true
            },
            {
              key: 'applicant-type-A7',
              value: 'Aquaculture',
              notEligible: true
            },
            {
              key: 'applicant-type-A8',
              value: 'Arable',
              notEligible: true
            },
            {
              key: 'applicant-type-A9',
              value: 'Horticulture',
              notEligible: true
            },
            {
              value: 'divider'
            },
            {
              key: 'applicant-type-A10',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'applicantType'
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is the legal status of the business?',
          pageTitle: '',
          backUrl: 'applicant-type',
          nextUrl: 'country',
          url: 'legal-status',
          baseUrl: 'legal-status',
          preValidationKeys: ['applicantType'],
          ineligibleContent: {
            messageContent: 'Your business does not have an eligible legal status.',
            details: {
              summaryText: 'Who is eligible',
              html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
            },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            },
            warning: {
              text: 'Other types of business may be supported in future schemes',
              iconFallbackText: 'Warning'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Public organisations and local authorities cannot apply for this grant.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the legal status of the business'
            }
          ],
          answers: [
            {
              key: 'legal-status-A1',
              value: 'Sole trader'
            },
            {
              key: 'legal-status-A2',
              value: 'Partnership'
            },
            {
              key: 'legal-status-A3',
              value: 'Limited company'
            },
            {
              key: 'legal-status-A4',
              value: 'Charity'
            },
            {
              key: 'legal-status-A5',
              value: 'Trust'
            },
            {
              key: 'legal-status-A6',
              value: 'Limited liability partnership'
            },
            {
              key: 'legal-status-A7',
              value: 'Community interest company'
            },
            {
              key: 'legal-status-A8',
              value: 'Limited partnership'
            },
            {
              key: 'legal-status-A9',
              value: 'Industrial and provident society'
            },
            {
              key: 'legal-status-A10',
              value: 'Co-operative society (Co-Op)'
            },
            {
              key: 'legal-status-A11',
              value: 'Community benefit society (BenCom)'
            },
            {
              value: 'divider'
            },
            {
              key: 'legal-status-A12',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'legalStatus'
        },
        {
          key: 'country',
          order: 30,
          title: 'Is the planned project in England?',
          hint: {
            text: 'The location of the calf housing'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'planning-permission',
          url: 'country',
          baseUrl: 'country',
          preValidationKeys: ['legalStatus'],
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `This grant is only for projects in England.
                
                Scotland, Wales and Northern Ireland have other grants available.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the project is in England'
            }
          ],
          answers: [
            {
              key: 'country-A1',
              value: 'Yes'
            },
            {
              key: 'country-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'inEngland'
        },
        {
          key: 'planning-permission',
          order: 40,
          title: 'Does the project have planning permission?',
          pageTitle: '',
          url: 'planning-permission',
          baseUrl: 'planning-permission',
          backUrl: 'country',
          nextUrl: 'project-started',
          preValidationKeys: ['inEngland'],
          ineligibleContent: {
            messageContent: 'Any planning permission must be in place before you submit your full application.',
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: 'Improving Adding Value',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `You must have secured planning permission before you submit a full application.

                        The application deadline is 30 April 2025.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select when the project will have project planning permission'
            }
          ],
          answers: [
            {
              key: 'planning-permission-A1',
              value: 'Not needed'
            },
            {
              key: 'planning-permission-A2',
              value: 'Secured'
            },
            {
              key: 'planning-permission-A3',
              value: 'Should be in place by the time I make my full application',
              redirectUrl: 'planning-permission-condition'
            },
            {
              key: 'planning-permission-A4',
              value: 'Will not be in place by the time I make my full application',
              notEligible: true
            }
          ],
          yarKey: 'planningPermission'
        },
        {
          key: 'planning-permission-condition',
          order: 41,
          url: 'planning-permission-condition',
          backUrl: 'planning-permission',
          nextUrl: 'project-started',
          maybeEligible: true,
          preValidationKeys: ['planningPermission'],
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'Any planning permission must be in place before you submit your full application. The application deadline is 30 April 2025.'
          },
          yarKey: 'planningPermissionCondition'
        },
        {
          key: 'project-started',
          order: 50,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-started',
          baseUrl: 'project-started',
          backUrl: 'planning-permission',
          nextUrl: 'tenancy',
          backUrlObject: {
            dependentQuestionYarKey: 'planningPermission',
            dependentAnswerKeysArray: ['planning-permission-A1', 'planning-permission-A2'],
            urlOptions: {
              thenUrl: 'planning-permission',
              elseUrl: 'planning-permission-condition'
            }
          },
          preValidationKeys: ['inEngland'],
          ineligibleContent: {
            messageContent: 'You cannot apply for a grant if you have already started work on the project.',
            insertText: { text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `
                You will invalidate your application if you start the project or commit to any costs (such as placing orders) before you receive a funding agreement.
                
                Before you start the project, you can:`,
                items: [
                  'get quotes from suppliers',
                  'apply for planning permission (this can take a long time)'
                ]
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to your project'
            }
          ],
          answers: [
            {
              key: 'project-started-A1',
              value: 'Yes, preparatory work',
              hint: {
                text: 'For example, quotes from suppliers, applying for planning permission'
              }
            },
            {
              key: 'project-started-A2',
              value: 'Yes, we have begun project work',
              hint: {
                text: 'For example, started construction work, signing contracts, placing orders'
              },
              notEligible: true
            },
            {
              key: 'project-started-A3',
              value: 'No, we have not done any work on this project yet'
            }
          ],
          yarKey: 'projectStart'
        },
        {
          key: 'tenancy',
          order: 60,
          title: 'Is the planned project on land the business owns?',
          hint: {
            text: 'The location of the calf housing'
          },
          pageTitle: '',
          url: 'tenancy',
          baseUrl: 'tenancy',
          backUrl: 'project-started',
          nextUrl: 'project',
          preValidationKeys: ['projectStart'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must own the land or have a tenancy in place for 5 years after the final grant payment.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the planned project is on land the business owns'
            }
          ],
          answers: [
            {
              key: 'tenancy-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-A2',
              value: 'No',
              redirectUrl: 'tenancy-length'
            }
          ],
          yarKey: 'tenancy'
        },
        {
          key: 'tenancy-length',
          order: 61,
          title: 'Do you have a tenancy agreement for 5 years after the final grant payment?',
          hint: {
            text: 'The location of the calf housing'
          },
          pageTitle: '',
          url: 'tenancy-length',
          baseUrl: 'tenancy-length',
          backUrl: 'tenancy',
          preValidationKeys: ['tenancy'],
          nextUrl: 'project',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must own the land or have a tenancy in place for 5 years after the final grant payment.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the land has a tenancy agreement in place for 5 years after the final grant payment.'
            }
          ],
          answers: [
            {
              key: 'tenancy-length-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-length-A2',
              value: 'No',
              redirectUrl: 'tenancy-length-condition'
            }
          ],
          yarKey: 'tenancyLength'
        },
        {
          key: 'tenancy-length-condition',
          title: 'You may be able to apply for a grant from this scheme',
          order: 62,
          url: 'tenancy-length-condition',
          backUrl: 'tenancy-length',
          preValidationKeys: ['tenancyLength'],
          nextUrl: 'project',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You will need to extend your tenancy agreement for 5 years after the final grant payment.'
          }
        },
        {
          key: 'project',
          order: 70,
          title: 'What is your project?',
          baseUrl: 'project',
          backUrl: 'tenancy',
          nextUrl: 'minimum-floor-area',
          url: 'project',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancyLength',
            dependentAnswerKeysArray: ['tenancy-length-A1'],
            urlOptions: {
              thenUrl: 'tenancy-length',
              elseUrl: 'tenancy-length-condition',
              nonDependentUrl: 'tenancy'
            }
          },
          preValidationKeys: ['tenancy'],
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">This grant is for:</p>
                      <ul>
                        <li>building new calf housing</li>
                        <li>upgrade existing buildings to house calves</li>
                      </ul>
                </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is for:',
                items: ['building new calf housing', 'upgrade existing buildings to house calves']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to you'
            }
          ],
          answers: [
            {
              key: 'project-A1',
              value: 'Building new calf housing'
            },
            {
              key: 'project-A2',
              value: 'Upgrade existing buildings to house calves'
            },
            {
              value: 'divider'
            },
            {
              key: 'project-A3',
              value: 'Something else',
              notEligible: true
            }
          ],
          yarKey: 'project'
        },
        {
          key: 'minimum-floor-area',
          order: 80,
          title: 'Will each calf have the minimum floor area?',
          baseUrl: 'minimum-floor-area',
          backUrl: 'project',
          nextUrl: 'housed-individually',
          url: 'minimum-floor-area',
          hint: {
            html: `<div class:"govuk-hint">
                    The minimum area must be:</br></br>
                    <ul>
                    <li>3m² per calf for calves under 100kg</li>
                    <li>4m² per calf for calves between 100kg and 150kg</li>
                    <li>5m² per calf for calves over 150kg</li>
                    </ul></br>

                    This includes the lying, standing and feeding/drinking areas.
                  </div>`
          },
          warning: {
            text: 'The required area per calf for each group or pair may change over time so the housing design should account for this.'
          },
          preValidationKeys: ['project'],
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                  Each calf must have the minimum floor area:
                  <ul>
                    <li>3m² per calf for calves under 100kg</li>
                    <li>4m² per calf for calves between 100kg and 150kg</li>
                    <li>5m² per calf for calves over 150kg</li></br>
                  </ul>
              </div>`,
            insertText: { text: 'This includes the lying, standing and feeding/drinking areas.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Each calf must have at least the minimum floor area.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if each calf will have the minimum floor area'
            }
          ],
          answers: [
            {
              key: 'minimum-floor-area-A1',
              value: 'Yes'
            },
            {
              key: 'minimum-floor-area-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'minimumFloorArea'
        },
        {
          key: 'housed-individually',
          order: 100,
          title: 'Will calves over 7 days old be housed individually?',
          baseUrl: 'housed-individually',
          url: 'housed-individually',
          nextUrl: 'isolate-calves',
          backUrl: 'minimum-floor-area',
          preValidationKeys: ['minimumFloorArea'],
          ineligibleContent: {
            messageContent: '<p class="govuk-body">Calves can only be housed individually in exceptional circumstances (for example, illness or no other calves of similar age).</p>',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Calves can only be housed individually in exceptional circumstances (for example, illness or no other calves of similar age).'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to you'
            }
          ],
          answers: [
            {
              key: 'housed-individually-A1',
              value: 'Yes',
              notEligible: true
            },
            {
              key: 'housed-individually-A2',
              value: 'No'
            },
            {
              key: 'housed-individually-A3',
              value: 'Only in exceptional circumstance',
              hint: {
                html: 'For example illness, no other calves of similar age'
              }
            }
          ],
          yarKey: 'housedIndividually'
        },
        {
          key: 'isolate-calves',
          order: 110,
          title: 'Will the building have facilities to temporarily isolate sick calves?',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          baseUrl: 'isolate-calves',
          url: 'isolate-calves',
          backUrl: 'housed-individually',
          nextUrl: 'flooring-and-bedding',
          preValidationKeys: ['housedIndividually'],
          ineligibleContent: {
            messageContent: 'The building must have facilities to temporarily isolate sick calves (for example, a temporary pen erected in an existing pen to isolate a sick calf).',
            insertText: { text: 'Sick calves may need to be temporarily isolated to prevent spreading disease.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The building must have facilities to temporarily isolate sick calves (for example, a temporary pen erected in an existing pen to isolate a sick calf).',
                additionalPara: 'Sick calves may need to be temporarily isolated to prevent spreading disease.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if there will be facilities to temporarily isolate sick calves'
            }
          ],
          answers: [
            {
              key: 'isolate-calves-A1',
              value: 'Yes'
            },
            {
              key: 'isolate-calves-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'isolateCalves'
        },
        {
          key: 'flooring-and-bedding',
          order: 130,
          title: 'Will the calf housing have both concrete flooring and cereal straw bedding?',
          baseUrl: 'flooring-and-bedding',
          url: 'flooring-and-bedding',
          hint: {
            text: 'It cannot have slatted or hardcore flooring'
          },
          backUrl: 'isolate-calves',
          nextUrl: 'enrichment',
          preValidationKeys: ['isolateCalves'],
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          ineligibleContent: {
            messageContent: 'The calf housing must have solid concrete flooring and cereal straw bedding.',
            insertText: { text: 'It cannot have slatted or hardcore flooring.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The calf housing must have solid concrete flooring and cereal straw bedding.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the calf housing will have concrete flooring and cereal straw bedding'
            }
          ],
          answers: [
            {
              key: 'flooring-and-bedding-A1',
              value: 'Yes'
            },
            {
              key: 'flooring-and-bedding-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'concreteFlooring'
        },
        {
          key: 'enrichment',
          order: 140,
          title: 'Will there be at least one enrichment item per pair or group of calves?',
          hint: {
            text: 'Not including straw bedding and social contact'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          baseUrl: 'enrichment',
          url: 'enrichment',
          backUrl: 'flooring-and-bedding',
          nextUrl: 'structure',
          preValidationKeys: ['concreteFlooring'],
          ineligibleContent: {
            messageContent: 'Each pair or group of calves must have at least one enrichment item (for example brushes or hanging balls).',
            insertText: {
              text: 'This does not include straw bedding and social contact.'
            },
            additionalPara: 'The grant will fund off-the-shelf items for cattle. Other enrichment items (for example cardboard boxes) are not funded.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Each pair or group of calves must have at least one enrichment item (for example brushes or hanging balls).',
                additionalPara: 'The grant will fund off-the-shelf items for cattle. Other enrichment items (for example cardboard boxes) are not funded.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if there will be at least one enrichment item per pair or group of calves'
            }
          ],
          answers: [
            {
              key: 'enrichment-A1',
              value: 'Yes'
            },
            {
              key: 'enrichment-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'enrichment'
        },
        {
          key: 'structure',
          order: 150,
          title: 'What type of structure is your building?',
          pageTitle: '',
          url: 'structure',
          baseUrl: 'structure',
          backUrl: 'enrichment',
          nextUrl: 'drainage-slope',
          preValidationKeys: ['enrichment'],
          ineligibleContent: {
            messageContent: `<p class="govuk-body">Each pair or group of calves must have at least one enrichment item, such as:</p>
                              <div class="govuk-list govuk-list--bullet">
                                    <ul>
                                      <li>brushes</li>
                                      <li>hanging balls</li>
                                    </ul>
                              </div>`,
            insertText: { text: 'This does not include straw bedding and social contact.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'All buildings must be permanent structures.'
                }]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to you'
            }
          ],
          answers: [
            {
              key: 'structure-A1',
              value: 'A-frame building'
            },
            {
              key: 'structure-A2',
              value: 'Mono-pitch building'
            },
            {
              key: 'structure-A3',
              value: 'A permanent open-sided structure with igloos/hutches'
            },
            {
              key: 'structure-A4',
              value: 'Other',
              redirectUrl: 'structure-eligibility'
            }
          ],
          yarKey: 'structure'
        },
        {
          key: 'structure-eligibility',
          order: 160,
          title: 'Does your building structure meet the eligibility criteria?',
          hint: {
            html: `<div class:"govuk-hint">
            All buildings must:</br></br>
            <ul>
            <li>be permanent structures</li>
            <li>have adequate drainage</li>
            <li>protect calves from draughts with solid walls/barriers to calf height</li></ul>
            </div>`
          },
          pageTitle: '',
          backUrl: 'structure',
          nextUrl: 'drainage-slope',
          url: 'structure-eligibility',
          baseUrl: 'structure-eligibility',
          preValidationKeys: ['structure'],
          preValidationKeysRule: { condition: 'ANY', dependency: 'Other' },
          ineligibleContent: {
            messageContent: `<p class="govuk-body">All buildings must:</p>
            <div class="govuk-list govuk-list--bullet">
                  <ul>
                    <li>be permanent structures</li>
                    <li>have adequate drainage</li>
                    <li>protect calves from draughts with solid walls/barriers to calf height</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your building structure meets the eligibility criteria'
            },
            {
              dependentKey: 'yesStructureEligibility',
              type: 'REGEX',
              regex: STRUCTURE_ELIGIBLITY_REGEX,
              error: 'Description must only include letters, numbers, full stops, commas, hyphens and apostrophes'
            },
            {
              dependentKey: 'yesStructureEligibility',
              type: 'NOT_EMPTY',
              error: 'Enter the description of the building structure'
            },
            {
              dependentKey: 'yesStructureEligibility',
              type: 'REGEX',
              regex: CHARS_MAX_25,
              error: 'Description must be 250 characters or less'
            }
          ],
          answers: [
            {
              key: 'structure-eligibility-A1',
              conditional: true,
              value: 'Yes'
            },
            {
              key: 'structure-eligibility-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'structureEligibility',
          conditionalKey: 'yesStructureEligibility',
          conditionalLabelData: 'Enter the description of the building structure'
        },
        {
          key: 'drainage-slope',
          order: 170,
          title: 'Will the floor in bedded areas slope towards a drain or drainage channel?',
          hint: {
            text: 'The floor must have at least 5% gradient'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          backUrlObject: {
            dependentQuestionYarKey: 'structure',
            dependentAnswerKeysArray: ['structure-A1', 'structure-A2', 'structure-A3'],
            urlOptions: {
              thenUrl: 'structure',
              elseUrl: 'structure-eligibility'
            }
          },
          nextUrl: 'draught-protection',
          url: 'drainage-slope',
          baseUrl: 'drainage-slope',
          preValidationKeys: ['structure'],
          ineligibleContent: {
            messageContent: 'The building must have sloped flooring with a 1 in 20 (5%) gradient in bedded areas that slopes towards a drain or drainage channel. ',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The building must have sloped flooring with a 1 in 20 (5%) gradient in bedded areas that slopes towards a drain or drainage channel.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the floor in bedded areas slope towards a drain or drainage channel'
            }
          ],
          answers: [
            {
              key: 'drainage-slope-A1',
              value: 'Yes'
            },
            {
              key: 'drainage-slope-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'drainageSlope'
        },
        {
          key: 'draught-protection',
          order: 180,
          title: 'Will calves be protected from draughts?',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          backUrl: 'drainage-slope',
          nextUrl: 'additional-items',
          url: 'draught-protection',
          baseUrl: 'draught-protection',
          preValidationKeys: ['drainageSlope'],
          ineligibleContent: {
            messageContent: 'All projects must have permanent external calf-height solid walls/barriers to keep out drafts.',
            insertText: { text: 'For a permanent open-sided structure with igloos/hutches, this may mean adding permanent solid sides to the outside pens (straw bales are not sufficient).' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `All projects must have permanent external calf-height solid walls/barriers to keep out drafts.

                      For a permanent open-sided structure with igloos/hutches, this may mean adding permanent solid sides to the outside pens (straw bales are not sufficient).`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the calves will be protected from draughts'
            }
          ],
          answers: [
            {
              key: 'draught-protection-A1',
              value: 'Yes'
            },
            {
              key: 'draught-protection-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'draughtProtection'
        },
        {
          key: 'additional-items',
          order: 190,
          title: 'Will the building have these items?',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          hint: {
            html: `<div class:"govuk-hint">
            The building must have:</br></br>
            <ul>
            <li>access to a water supply</li>
            <li>at least 2 IP66 electrical sockets in the building</li>
            <li>fitted lighting of at least 50 lux (lux is equal to one lumen per square metre)</li>
            <li>temperature and humidity data loggers (capable of autonomously recording temperature/humidity over a defined period and storing data to view later)</li>
            </ul>
            </div>`
          },
          pageTitle: '',
          backUrl: 'draught-protection',
          nextUrl: 'roof-solar-PV',
          url: 'additional-items',
          baseUrl: 'additional-items',
          preValidationKeys: ['draughtProtection'],
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'The building must have:',
                  items: [
                    'access to a water supply',
                    'at least 2 IP66 electrical sockets in the building',
                    'fitted lighting of at least 50 lux',
                    'temperature and humidity data loggers'
                  ]
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: `<p class="govuk-body">The building must have:</p>
            <div class="govuk-list govuk-list--bullet">
                  <ul>
                    <li>access to a water supply</li>
                    <li>at least 2 IP66 electrical sockets in the building</li>
                    <li>fitted lighting of at least 50 lux (lux is equal to one lumen per square metre)</li>
                    <li>temperature and humidity data loggers (capable of autonomously recording temperature/humidity over a defined period and storing data to view later)</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have these items'
            }
          ],
          answers: [
            {
              key: 'additional-items-A1',
              value: 'Yes'
            },
            {
              key: 'additional-items-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'additionalItems'
        },
        {
          key: 'roof-solar-PV',
          order: 210,
          title: 'Will the roof of the grant-funded calf housing be able to support solar PV panels?',
          hint: {
            html: `<div class:"govuk-hint">
            You must provide confirmation from a building expert, contractor or structural engineer that your roof can support PV panels for your full application. Confirmation is not funded by this grant.</br></br>
            Your roof is exempt if:
            <ul>
            <li>the building is listed or on a World Heritage Site</li>
            <li> you've upgraded an existing building and would not otherwise make changes to the roof </li>
            <li>the roof faces only north or is heavily shaded </li>
            <li>the roof does not have 20m² of clear roof space </li>
            <li>the roof has a pitch less than 15 degrees or greater than 50 degrees</li>
            </ul>
            </div>`
          },
          pageTitle: '',
          backUrl: 'additional-items',
          nextUrlObject: {
            dependentQuestionYarKey: 'project',
            dependentAnswerKeysArray: ['project-A1'],
            urlOptions: {
              thenUrl: 'heritage-site',
              elseUrl: 'upgrading-existing-building'
            }
          },
          url: 'roof-solar-PV',
          baseUrl: 'roof-solar-PV',
          preValidationKeys: ['additionalItems'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The roof must be able to support solar PV panels, allowing for potential use in the future.'
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `<p class="govuk-body">The roof must be able to support solar PV panels unless:</p>
            <div class="govuk-list govuk-list--bullet">
                  <ul>
                    <li>the building is listed or on a World Heritage Site</li>
                    <li>you've upgraded an existing building and would not otherwise make changes to the roof</li>
                    <li>the roof faces only north or is heavily shaded</li>
                    <li>the roof does not have 20m² of clear roof space</li>
                    <li>the roof has a pitch less than 15 degrees or greater than 50 degrees</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the roof is able to support solar PV panels'
            }
          ],
          answers: [
            {
              key: 'roof-solar-PV-A1',
              value: 'Yes',
              redirectUrl: 'solar-PV-system'
            },
            {
              key: 'roof-solar-PV-A2',
              value: 'No',
              notEligible: true
            },
            {
              key: 'roof-solar-PV-A3',
              value: 'My roof is exempt'
            }
          ],
          yarKey: 'roofSolarPV'
        },
        {
          key: 'upgrading-existing-building',
          order: 211,
          title: 'Are you upgrading an existing building and not making changes to the roof?',
          pageTitle: '',
          hint: {
            text: 'You can apply for grant funding to buy and install a solar PV system if you are upgrading an existing building and not making changes to the roof.'
          },
          backUrl: 'roof-solar-PV',
          nextUrl: 'solar-PV-system',
          url: 'upgrading-existing-building',
          baseUrl: 'upgrading-existing-building',
          preValidationKeys: ['roofSolarPV'],
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you are upgrading an existing building and not making changes to the roof'
            }
          ],
          answers: [
            {
              key: 'upgrading-existing-building-A1',
              value: 'Yes'
            },
            {
              key: 'upgrading-existing-building-A2',
              value: 'No',
              redirectUrl: 'heritage-site'
            }
          ],
          yarKey: 'upgradingExistingBuilding'
        },
        {
          key: 'heritage-site',
          order: 212,
          title: 'Is your building listed or on a World Heritage Site?',
          pageTitle: '',
          hint: {
            text: 'You can apply for grant funding to buy and install a solar PV system if your building is listed or on a World Heritage Site.'
          },
          backUrlObject: {
            dependentQuestionYarKey: 'project',
            dependentAnswerKeysArray: ['project-A1'],
            urlOptions: {
              thenUrl: 'roof-solar-PV',
              elseUrl: 'upgrading-existing-building'
            }
          },
          nextUrl: 'solar-PV-system',
          url: 'heritage-site',
          baseUrl: 'heritage-site',
          preValidationKeys: ['roofSolarPV'],
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if your building is listed or on a World Heritage Site'
            }
          ],
          answers: [
            {
              key: 'heritage-site-A1',
              value: 'Yes'
            },
            {
              key: 'heritage-site-A2',
              value: 'No',
              redirectUrl: 'project-cost'
            }
          ],
          yarKey: 'heritageSite'
        },
        {
          key: 'solar-PV-system',
          order: 213,
          title: 'Will you buy a solar PV system with this grant?',
          hint: {
            html: `<div class:"govuk-hint">
            You can choose to buy and install a solar PV system on the grant-funded calf housing as part of the grant.</br></br>
            A solar PV system can include:
            <ul>
            <li>an electrical grid connection (your housing must have an existing energy supply)</li>
            <li>solar panels</li>
            <li>an inverter</li>
            <li>a utility meter</li>
            <li>a battery</li>
            </ul>
            </div>`
          },
          pageTitle: '',
          backUrlObject: {
            dependentQuestionYarKey: ['upgradingExistingBuilding', 'heritageSite'],
            dependentAnswerKeysArray: ['upgrading-existing-building-A2', 'heritage-site-A1'],
            urlOptions: {
              thenUrl: 'heritage-site',
              elseUrl: 'upgrading-existing-building',
              nonDependentUrl: 'roof-solar-PV'
            }
          },
          nextUrl: 'project-cost-solar',
          url: 'solar-PV-system',
          baseUrl: 'solar-PV-system',
          preValidationKeys: ['roofSolarPV'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You do not have to buy and install a solar PV system to be eligible for this grant'
              }]
            }]
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you will use the grant for a solar PV system'
            }
          ],
          answers: [
            {
              key: 'solar-PV-system-A1',
              value: 'Yes'
            },
            {
              key: 'solar-PV-system-A2',
              value: 'No',
              redirectUrl: 'project-cost'
            }
          ],
          yarKey: 'solarPVSystem'
        },
        {
          key: 'project-cost-solar',
          order: 214,
          pageTitle: '',
          title: 'Estimated project costs',
          classes: 'govuk-input--width-10',
          url: 'project-cost-solar',
          baseUrl: 'project-cost-solar',
          backUrl: 'solar-PV-system',
          nextUrl: 'potential-amount-solar',
          fundingPriorities: '',
          preValidationKeys: ['solarPVSystem'],
          type: 'multi-input',
          grantInfo: {
            minGrant: MIN_GRANT,
            maxGrant: MAX_GRANT,
            grantPercentage: GRANT_PERCENTAGE,
            cappedGrant: true
          },
          grantInfoSolar: {
            minGrant: 0,
            maxGrant: 485000,
            grantPercentage: 25,
            cappedGrant: false
          },
          hint: {
            html: `
                  <p>You can only apply for a grant of up to:<p/>
                  <ul>
                    <li>40% of the estimated costs of calf housing</li>
                    <li>25% of the estimated costs of buying and installing a solar PV system</li>
                  </ul>
                  <p>The minimum grant amount you can apply for the calf housing costs is £15,000 (40% of £37,500). The maximum grant is £500,000.</p>
                  <p>Do not include VAT<p/>
                  <p>Enter total estimated amounts, for example 95,000<p/>
              `
          },
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              yarKey: 'calfHousingCost',
              type: 'number',
              classes: 'govuk-input--width-10',
              label: {
                html: '<b>Calf housing costs</b>',
                classes: 'govuk-label'
              },
              prefix: {
                text: '£'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the estimated total cost of the calf housing'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 9999999,
                  error: 'Enter a whole number with a maximum of 7 digits'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Enter a whole number with a maximum of 7 digits'
                }
              ]
            },
            {
              yarKey: 'SolarPVCost',
              type: 'number',
              classes: 'govuk-input--width-10',
              label: {
                html: '<b>Solar PV system costs</b>',
                classes: 'govuk-label'
              },
              prefix: {
                text: '£'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the estimated total cost of the solar PV system'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 9999999,
                  error: 'Enter a whole number with a maximum of 7 digits'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Enter a whole number with a maximum of 7 digits'
                }
              ]
            }
          ],
          ineligibleContent: {
            messageHeader: 'You cannot apply for a grant from this scheme',
            messageContent: 'The minimum grant you can apply for the calf housing costs is £15,000 (40% of £37,500). The maximum grant is £500,000.',
            insertText: { text: 'You cannot apply for funding for a solar PV system if you have not requested the minimum funding amount for calf housing.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          yarKey: 'projectCostSolar'
        },
        {
          key: 'project-cost',
          order: 220,
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'project-cost',
          baseUrl: 'project-cost',
          backUrlObject: {
            dependentQuestionYarKey: 'heritageSite',
            dependentAnswerKeysArray: ['heritage-site-A2'],
            urlOptions: {
              thenUrl: 'heritage-site',
              elseUrl: 'solar-PV-system',
              nonDependentUrl: 'solar-PV-system'
            }
          },
          nextUrl: 'potential-amount',
          fundingPriorities: '',
          preValidationKeys: ['roofSolarPV'],
          grantInfo: {
            minGrant: MIN_GRANT,
            maxGrant: MAX_GRANT,
            grantPercentage: GRANT_PERCENTAGE,
            cappedGrant: true
          },
          type: 'input',
          prefix: {
            text: '£'
          },
          label: {
            text: 'What is the total estimated cost of the calf housing?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
                  <p>You can only apply for a grant of up to 40% of the estimated costs. The minimum grant you can apply for this project is £15,000 (40% of £37,500). The maximum grant is £500,000.<p/>
                  <p>Do not include VAT<p/>
                  <p>Enter amount, for example 95,000<p/>
              `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the estimated total cost for the items'
            },
            {
              type: 'REGEX',
              regex: PROJECT_COST_REGEX,
              error: 'Enter a whole number with a maximum of 7 digits'
            },
            {
              type: 'MIN_MAX_CHARS',
              min: 1,
              max: 7,
              error: 'Enter a whole number with a maximum of 7 digits'
            }
          ],
          ineligibleContent: {
            messageContent: 'The minimum grant you can apply for the calf housing costs is £15,000 (40% of £37,500). The maximum grant is £500,000.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'potential-amount',
          order: 230,
          url: 'potential-amount',
          baseUrl: 'potential-amount',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.',
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'potential-amount-capped',
          order: 231,
          url: 'potential-amount-capped',
          baseUrl: 'potential-amount-capped',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: `The maximum grant you can apply for is £500,000.
            You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.`,
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'potential-amount-solar',
          order: 232,
          url: 'potential-amount-solar',
          baseUrl: 'potential-amount-solar',
          backUrl: 'project-cost-solar',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: `<p class="govuk-body">You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}</p>
            <p class="govuk-body">This grant amount combines:<p>
            <ul>
            <li>£{{_calculatedGrantCalf_}} for calf housing costs (40% of £{{_calfHousingCost_}})</li>
            <li>£{{_calculatedGrantSolar_}} for solar PV costs (25% of £{{_SolarPVCost_}})</li>
            </ul>`,
            warning: {
              text: 'There\'s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'potential-amount-solar-capped',
          order: 233,
          url: 'potential-amount-solar-capped',
          baseUrl: 'potential-amount-solar-capped',
          backUrl: 'project-cost-solar',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: `<p class="govuk-body">You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}</p>
            <p class="govuk-body">This grant amount combines:<p>
            <ul>
            <li>£{{_calculatedGrantCalf_}} for calf housing costs (40% of £{{_calfHousingCost_}})</li>
            <li>£{{_calculatedGrantSolar_}} for solar PV costs (25% of £{{_SolarPVCost_}} is £{{_calculatedGrantSolarPreCap_}}, capped at £{{_calculatedGrantSolar_}})</li>
            </ul>
            <p class="govuk-body">As calf housing costs take grant funding priority, you may be able to apply for a grant of up to £{{_calculatedGrantSolar_}} for solar PV system costs. The maximum grant is £500,000.`,
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'potential-amount-conditional',
          order: 232,
          url: 'potential-amount-conditional',
          baseUrl: 'potential-amount-conditional',
          backUrl: 'project-cost-solar',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You have requested the maximum grant amount of £500,000 for calf housing.',
            warning: {
              text: 'You cannot apply for funding for a solar PV system if you have requested the maximum funding amount for calf housing.'
            },
            extraMessageContent: '<p class="govuk-body">You can continue to check your eligibility for grant funding to build or upgrade calf housing.'
          }
        },
        {
          key: 'remaining-costs',
          order: 240,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'potential-amount',
          nextUrl: 'housing',
          preValidationKeys: ['projectCost'],
          ineligibleContent: {
            messageContent: '<p class="govuk-body">You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.</p>',
            insertText: {
              html: `
                  <p>You can use:</p>
                  <ul class="govuk-list--bullet">
                    <li>loans</li>
                    <li>overdrafts</li>
                    <li>the Basic Payment Scheme</li>
                  </ul>
            </span>`
            },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
                  
                  You can use:`,
                  items: [
                    'loans',
                    'overdrafts',
                    'the Basic Payment Scheme'
                  ]
                }]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you can pay the remaining costs'
            }
          ],
          answers: [
            {
              key: 'remaining-costs-A1',
              value: 'Yes'

            },
            {
              key: 'remaining-costs-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'remainingCosts'
        },
        {
          key: 'housing',
          order: 250,
          url: 'housing',
          baseUrl: 'housing',
          backUrl: 'remaining-costs',
          nextUrl: 'group-size',
          preValidationKeys: ['remainingCosts'],
          pageTitle: '',
          title: 'Are you moving from individually housing calves over 7 days old to pair or group housing?',
          fundingPriorities: '',
          type: 'single-answer',
          ga: { name: 'eligibility_passed', params: {} },
          score: {
            isScore: true
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you are moving from individually housed calves over 7 days old to pair or group housing'
            }
          ],
          answers: [
            {
              key: 'housing-A1',
              value: 'Yes'
            },
            {
              key: 'housing-A2',
              value: 'No'
            }
          ],
          sidebar: {
            values: [
              {
                heading: 'Funding Priorities',
                content: [{
                  para: 'The RPA want to fund projects that will increase social contact between calves.',
                  additionalPara: 'By law, calves cannot be housed individually beyond 8 weeks.'
                }]
              }
            ]
          },
          yarKey: 'housing'
        },
        {
          key: 'calf-group-size',
          order: 260,
          url: 'group-size',
          baseUrl: 'group-size',
          backUrl: 'housing',
          nextUrl: 'moisture-control',
          preValidationKeys: ['housing'],
          pageTitle: '',
          title: 'What will be the average group size for calves over 7 days old?',
          fundingPriorities: '',
          type: 'single-answer',
          score: {
            isScore: true
          },
          sidebar: {
            values: [
              {
                heading: 'Funding Priorities',
                content: [{
                  para: 'RPA wants to fund projects that increase social interaction for calves, with a preference for groups of 4 to 8, followed by groups with fewer than 13 calves.'
                }]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what size the average calf group will be for calves over 7 days old'
            }
          ],
          answers: [
            {
              key: 'calf-group-size-A1',
              value: '2 to 3'
            },
            {
              key: 'calf-group-size-A2',
              value: '4 to 8'
            },
            {
              key: 'calf-group-size-A3',
              value: '9 to 12'
            },
            {
              key: 'calf-group-size-A4',
              value: '13 or more'
            }
          ],
          yarKey: 'calfGroupSize'
        },
        {
          key: 'moisture-control',
          order: 290,
          url: 'moisture-control',
          baseUrl: 'moisture-control',
          backUrl: 'group-size',
          nextUrl: 'permanent-sick-pen',
          preValidationKeys: ['calfGroupSize'],
          pageTitle: '',
          title: 'How will your building control moisture?',
          hint: {
            text: 'Select all that apply'
          },
          fundingPriorities: '',
          type: 'multi-answer',
          score: {
            isScore: true
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how your building will control moisture'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'moisture-control',
                answerKey: 'moisture-control-A4'
              }
            }
          ],
          answers: [
            {
              key: 'moisture-control-A1',
              value: 'A drain or drainage channel inside the pen'
            },
            {
              key: 'moisture-control-A2',
              value: 'Positioning drinking areas near drainage and away from bedding'
            },
            {
              key: 'moisture-control-A3',
              value: 'A separate preparation or washing area'
            },
            {
              value: 'divider'
            },
            {
              key: 'moisture-control-A4',
              value: 'None of the above'
            }
          ],
          sidebar: {
            values: [
              {
                heading: 'Funding Priorities',
                content: [{
                  para: 'RPA wants to fund projects that go beyond the regulatory baseline to control building moisture.'
                }]
              }
            ]
          },
          yarKey: 'moistureControl'
        },
        {
          key: 'permanent-sick-pen',
          order: 300,
          title: 'What type of sick pen will your building have?',
          hint: {
            text: 'Select all that apply'
          },
          pageTitle: '',
          preValidationKeys: ['moistureControl'],
          url: 'permanent-sick-pen',
          baseUrl: 'permanent-sick-pen',
          backUrl: 'moisture-control',
          warning: {
            text: 'To create a separate air space, the area must have solid walls up to ceiling height blocking it from the calf housing.'
          },
          // nextUrl: 'environmental-impact',
          nextUrlObject: {
            dependentQuestionYarKey: 'SolarPVCost',
            dependentAnswerKeysArray: [
            ],
            urlOptions: {
              thenUrl: 'environmental-impact',
              elseUrl: 'rainwater'
            }
          },
          sidebar: {
            values: [{
              heading: 'Funding Priorities',
              content: [{
                para: 'RPA wants to fund buildings that go beyond the regulatory baseline by having:',
                items: ['a permanent sick pen', 'a separate air space', 'a permanent heat source (for example heat lamps)'],
                additionalPara: 'To create a separate air space, the area must have solid walls up to ceiling height blocking it from the calf housing.'

              }]
            }]
          },
          fundingPriorities: '',
          type: 'multi-answer',
          score: {
            isScore: true
          },
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if your building will have a permanent sick pen with separate air space'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'permanent-sick-pen',
                answerKey: 'permanent-sick-pen-A4'
              }
            }
          ],
          answers: [
            {
              key: 'permanent-sick-pen-A1',
              value: 'A permanent sick pen'
            },
            {
              key: 'permanent-sick-pen-A2',
              value: 'A separate air space'
            },
            {
              key: 'permanent-sick-pen-A3',
              value: 'A permanent heat source (for example heat lamps)'
            },
            {
              value: 'divider'
            },
            {
              key: 'permanent-sick-pen-A4',
              value: 'None of the above'
            }
          ],
          yarKey: 'permanentSickPen'
        },
        {
          key: 'environmental-impact',
          order: 320,
          title: 'How will the building minimise environmental impact?',
          hint: {
            text: 'Select all that apply'
          },
          pageTitle: '',
          url: 'environmental-impact',
          baseUrl: 'environmental-impact',
          preValidationKeys: ['permanentSickPen'],
          backUrl: 'permanent-sick-pen',
          nextUrl: 'sustainable-materials',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund buildings that enhance environmental sustainability and help meet government environmental targets.'
              }]
            }]
          },
          fundingPriorities: '',
          type: 'multi-answer',
          score: {
            isScore: true
          },
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how your building will minimise environmental impact'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'environmental-impact',
                answerKey: 'environmental-impact-A3'
              }
            }
          ],
          answers: [
            {
              key: 'environmental-impact-A1',
              value: 'Solar PV panels on the roof of the building'
            },
            {
              key: 'environmental-impact-A2',
              value: 'Collect and store rainwater'
            },
            {
              value: 'divider'
            },
            {
              key: 'environmental-impact-A3',
              value: 'None of the above'
            }
          ],
          yarKey: 'environmentalImpact'
        },
        {
          key: 'rainwater',
          order: 320,
          title: 'Will your building collect and store rainwater?',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          url: 'rainwater',
          baseUrl: 'rainwater',
          preValidationKeys: ['permanentSickPen'],
          backUrl: 'permanent-sick-pen',
          nextUrl: 'sustainable-materials',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund buildings that enhance environmental sustainability and help meet government environmental targets.'
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          score: {
            isScore: true
          },
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your building will collect and store rainwater'
            }
          ],
          answers: [
            {
              key: 'environmental-impact-A2',
              text: 'Yes',
              value: 'Collect and store rainwater'
            },
            {
              key: 'environmental-impact-A3',
              text: 'No',
              value: 'None of the above'
            }
          ],
          yarKey: 'environmentalImpact'
        },
        {
          key: 'sustainable-materials',
          order: 330,
          title: 'Will your building use sustainable materials?',
          hint: {
            text: 'Select all that apply'
          },
          pageTitle: '',
          url: 'sustainable-materials',
          baseUrl: 'sustainable-materials',
          backUrlObject: {
            dependentQuestionYarKey: 'SolarPVCost',
            dependentAnswerKeysArray: [
            ],
            urlOptions: {
              thenUrl: 'environmental-impact',
              elseUrl: 'rainwater'
            }
          },
          nextUrl: 'introducing-innovation',
          preValidationKeys: ['environmentalImpact'],
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA wants to fund buildings that use sustainable materials.

                      You should consult building experts for advice on building materials to ensure they are fit for purpose.`,
                items: []
              }]
            }]
          },
          fundingPriorities: '',
          type: 'multi-answer',
          score: {
            isScore: true
          },
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if your building will use sustainable materials'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'sustainable-materials',
                answerKey: 'sustainable-materials-A8'
              }
            }
          ],
          answers: [
            {
              key: 'sustainable-materials-A1',
              value: 'Low carbon concrete',
              hint: {
                text: 'Alternatives to Ordinary Portland Cement that have higher embodied CO2 (for example, lower carbon aggregates, Portland Limestone Cements or low-cement-concrete)'
              }
            },
            {
              key: 'sustainable-materials-A2',
              value: 'Steel replacement products',
              hint: {
                text: 'Fibre reinforced polymer (FRP), resin pilling, carbon fibre'
              }
            },
            {
              key: 'sustainable-materials-A3',
              value: 'Sustainably sourced timber',
              hint: {
                text: 'Timber certified by FSC, PEFC, SFI, or CSA'
              }
            },
            {
              key: 'sustainable-materials-A4',
              value: 'Reused materials already on site',
              hint: {
                text: 'For example wooden cladding, fencing, pen dividers'
              }
            },
            {
              key: 'sustainable-materials-A5',
              value: 'Reused or secondhand materials from elsewhere',
              hint: {
                text: `Wooden cladding, fencing, pen dividers if sourced on site. If elsewhere,
                      a supplier quote must include a statement that the item has not been previously purchased with public funding, 
                      is fit for purpose and is expected to last at least 5 years`
              }
            },
            {
              key: 'sustainable-materials-A6',
              value: 'Recycled materials',
              hint: {
                text: 'Materials with a recycled content of more than 40%'
              }
            },
            {
              key: 'sustainable-materials-A7',
              value: 'Something else'
            },
            {
              value: 'divider'
            },
            {
              key: 'sustainable-materials-A8',
              value: 'None of the above'
            }
          ],
          yarKey: 'sustainableMaterials'
        },
        {
          key: 'introducing-innovation',
          order: 340,
          title: 'Is your project introducing innovation?',
          hint: {
            html: `Collaborations, technologies or techniques that are new to your farm
                  <p> Select all that apply</p> `
          },
          pageTitle: '',
          url: 'introducing-innovation',
          baseUrl: 'introducing-innovation',
          backUrl: 'sustainable-materials',
          nextUrl: 'score',
          preValidationKeys: ['sustainableMaterials'],
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that introduce innovation, such as:',
                items: [
                  'technology',
                  'collaboration',
                  'techniques'
                ]
              }]
            }]
          },
          fundingPriorities: '',
          type: 'multi-answer',
          score: {
            isScore: true
          },
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how your project is introducing innovation'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'introducing-innovation',
                answerKey: 'introducing-innovation-A4'
              }
            }
          ],
          answers: [
            {
              key: 'introducing-innovation-A1',
              value: 'Technology',
              hint: {
                text: 'Machinery or equipment that is new to your funded building. For example, automated ventilation control systems, veterinary equipment.'
              }
            },
            {
              key: 'introducing-innovation-A2',
              value: 'Collaboration',
              hint: {
                text: 'Collaborations that are new to your farm or build significantly on existing partnerships. For example, partnerships with educational institutions, other farms or the local community.'
              }
            },
            {
              key: 'introducing-innovation-A3',
              value: 'Techniques',
              hint: {
                text: 'Techniques that improve stockperson’s skills or animal health and welfare. For example, the use of long-term analgesics for castration or disbudding.'
              }
            },
            {
              value: 'divider'
            },
            {
              key: 'introducing-innovation-A4',
              value: 'None of the above'
            }
          ],
          yarKey: 'introducingInnovation'
        },
        {
          key: 'score',
          order: 350,
          title: 'Score results',
          url: 'score',
          baseUrl: 'score',
          backUrl: 'introducing-innovation',
          nextUrl: 'business-details',
          preValidationKeys: ['introducingInnovation'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Your results',
            messageContent: `Based on your answers, your project is:
            <div class="govuk-inset-text">
              <span class="govuk-heading-m">Eligible to apply</span>
              </div>
              <p class='govuk-body'>
              The RPA wants to fund projects that have a higher environmental benefit. <br/><br/>
              We will do this by prioritising projects in areas that need urgent action 
              to reduce nutrient pollution from agriculture and restore natural habitats.<br/><br/>
              Depending on the number of applications received, we may invite projects 
              outside these areas to submit a full application.</p>`,
            extraMessageContent: `
            <h2 class="govuk-heading-m">Next steps</h2>
            <p class="govuk-body">Next, add your business and contact details and submit them to the RPA (you should only do this once).
            <br/><br/>
            You’ll get an email with your answers and a reference number.</p>`
          },
          answers: []
        },

        /// ////// ***************** After Score  ************************************/////////////////////
        {
          key: 'business-details',
          order: 360,
          title: 'Business details',
          pageTitle: '',
          url: 'business-details',
          baseUrl: 'business-details',
          backUrl: 'score',
          nextUrl: 'applying',
          preValidationKeys: ['introducingInnovation'],
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              yarKey: 'projectName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Project name',
                classes: 'govuk-label'
              },
              hint: {
                text: 'For example Browns Hill Farm calf housing project'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a project name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              hint: {
                text: "If you're registered on the Rural Payments system, enter business name as registered"
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'numberEmployees',
              type: 'text',
              classes: 'govuk-input--width-4',
              inputmode: "numeric",
              label: {
                text: 'Number of employees',
                classes: 'govuk-label'
              },
              hint: {
                text: 'Full-time employees, including the owner'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the number of employees'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Number of employees must be a whole number, like 305'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 9999,
                  error: 'Number must be between 1-9999'
                }
              ]
            },
            {
              yarKey: 'businessTurnover',
              type: 'number',
              classes: 'govuk-input--width-10',
              prefix: {
                text: '£'
              },
              label: {
                text: 'Business turnover (£)',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the business turnover'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Business turnover must be a whole number, like 100000'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 999999999,
                  error: 'Number must be between 1-999999999'
                }
              ]
            },
            {
              yarKey: 'sbi',
              type: 'text',
              title: 'Single Business Identifier (SBI) - Optional',
              classes: 'govuk-input govuk-input--width-10',
              label: {
                text: 'Single Business Identifier (SBI) - Optional',
                classes: 'govuk-label'
              },
              hint: {
                html: 'If you do not have an SBI, you will need to get one for full application'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: SBI_REGEX,
                  error: 'SBI number must have 9 characters, like 011115678'
                }
              ]
            },
            {
              yarKey: 'calvingSystem',
              type: 'select',
              title: 'Calving system (optional)',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Calving system (optional)',
                classes: 'govuk-label'
              },
              answers: [
                'Year round',
                'Spring block',
                'Autumn block',
                'Other'
              ]
            },
            {
              yarKey: 'calvesNumber',
              type: 'text',
              title: 'Number of calves (optional)',
              classes: 'govuk-input--width-4',
              label: {
                text: 'Number of calves (optional)',
                classes: 'govuk-label'
              },
              hint: {
                text: 'Maximum number of calves housed annually after project'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: ONLY_DIGITS_REGEX,
                  error: 'Number of calves should only include numbers'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Number of calves must be a whole number'
                },
                {
                  type: 'MAX_ONLY', // max only
                  max: 9999999,
                  error: 'Number must be between 1-9999999'
                }
              ]
            }
          ],
          yarKey: 'businessDetails'
        },
        {
          key: 'applying',
          order: 370,
          title: 'Who is applying for this grant?',
          pageTitle: '',
          url: 'applying',
          baseUrl: 'applying',
          backUrl: 'business-details',
          preValidationKeys: ['businessDetails'],
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select who is applying for this grant'
            }
          ],
          answers: [
            {
              key: 'applying-A1',
              value: 'Applicant',
              redirectUrl: 'applicant-details'
            },
            {
              key: 'applying-A2',
              value: 'Agent',
              redirectUrl: 'agent-details'
            }
          ],
          yarKey: 'applying'
        },
        {
          key: 'farmer-details',
          order: 380,
          title: 'Applicant’s details',
          pageTitle: '',
          url: 'applicant-details',
          baseUrl: 'applicant-details',
          nextUrl: 'check-details',
          preValidationKeys: ['applying'],
          backUrlObject: {
            dependentQuestionYarKey: 'applying',
            dependentAnswerKeysArray: ['applying-A2'],
            urlOptions: {
              thenUrl: 'agent-details',
              elseUrl: 'applying'
            }
          },
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          hint: {
            text: 'Enter the farmer and farm business details'
          },
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to send you confirmation'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'confirmEmailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Confirm email address',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Confirm your email address'
                },
                {
                  type: 'CONFIRMATION_ANSWER',
                  fieldsToCampare: ['emailAddress', 'confirmEmailAddress'],
                  error: 'Enter an email address that matches'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              endFieldset: 'true',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your address line 1'
                },
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 2 (optional)',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'town',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                },
                {
                  type: 'REGEX',
                  regex: ONLY_TEXT_REGEX,
                  error: 'Town must only include letters, hyphens and spaces'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [
                ...LIST_COUNTIES
              ],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'text',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Business postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a business postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a business postcode, like AA1 1AA'
                }
              ]
            },
            {
              yarKey: 'projectPostcode',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Project postcode',
                classes: 'govuk-label'
              },
              hint: {
                text: 'The site postcode where the work will happen'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a project postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a project postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'farmerDetails'

        },
        {
          key: 'agent-details',
          order: 390,
          title: 'Agent’s details',
          hint: {
            text: 'Enter the agent and agent business details'
          },
          pageTitle: '',
          url: 'agent-details',
          baseUrl: 'agent-details',
          backUrl: 'applying',
          nextUrl: 'applicant-details',
          summaryPageUrl: 'check-details',
          preValidationKeys: ['applying'],
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to send you confirmation'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'confirmEmailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Confirm email address',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Confirm your email address'
                },
                {
                  type: 'CONFIRMATION_ANSWER',
                  fieldsToCampare: ['emailAddress', 'confirmEmailAddress'],
                  error: 'Enter an email address that matches'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Mobile phone number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              type: 'tel',
              endFieldset: 'true',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your address line 1'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Address line 2 (optional)',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                },
                {
                  type: 'REGEX',
                  regex: ONLY_TEXT_REGEX,
                  error: 'Town must only include letters, hyphens and spaces'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [
                ...LIST_COUNTIES
              ],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'agentsDetails'

        },
        {
          key: 'check-details',
          order: 400,
          title: 'Check your details',
          pageTitle: 'Check details',
          url: 'check-details',
          backUrl: 'applicant-details',
          nextUrl: 'confirm',
          preValidationKeys: ['applying'],
          ineligibleContent: {},
          pageData: {
            businessDetailsLink: 'business-details',
            agentDetailsLink: 'agent-details',
            farmerDetailsLink: 'applicant-details'
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        },
        {
          key: 'confirm',
          title: 'Confirm and send',
          order: 410,
          url: 'confirm',
          backUrl: 'check-details',
          nextUrl: 'confirmation',
          preValidationKeys: ['farmerDetails'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `I confirm that, to the best of my knowledge, the details I have provided are correct.</br></br>
            I understand the project’s eligibility and score is based on the answers I provided.</br></br>
            I am aware that the information I submit will be checked by the RPA.</br></br>
            I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.
            <h2 class="govuk-heading-m">Improving our schemes</h2>
            Defra may wish to contact you to take part in optional research activities to help us improve our programmes and delivery. 
            Please confirm if you are happy for us to contact you to take part in optional research activities.`
          },
          answers: [
            {
              key: 'consentOptional',
              value: 'CONSENT_OPTIONAL'
            }
          ],
          yarKey: 'consentOptional'
        },
        {
          key: 'reference-number',
          order: 420,
          title: 'Details submitted',
          pageTitle: '',
          url: 'confirmation',
          baseUrl: 'confirmation',
          preValidationKeys: ['farmerDetails'],
          ga: { name: 'confirmation', params: {} },
          maybeEligible: true,
          maybeEligibleContent: {
            reference: {
              titleText: 'Details submitted',
              html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
              surveyLink: process.env.SURVEY_LINK
            },
            messageContent: `We have sent you a confirmation email with a record of your answers.<br/><br/>
            If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Transformation Fund scheme:<br/>
            <h2 class="govuk-heading-m">RPA helpline</h2>
            <h3 class="govuk-heading-s">Telephone</h3>
            Telephone: 0300 0200 301<br/>
            Monday to Friday, 9am to 5pm (except public holidays)<br/>
            <p><a class="govuk-link" target="_blank" href="https://www.gov.uk/call-charges" rel="noopener noreferrer">Find out about call charges</a></p>
            <h3 class="govuk-heading-s">Email</h3>
            <a class="govuk-link" title="Send email to RPA" target="_blank" rel="noopener noreferrer" href="mailto:ftf@rpa.gov.uk">FTF@rpa.gov.uk</a><br/><br/>
            
            <h2 class="govuk-heading-m">What happens next</h2>
            <p>1. RPA will be in touch when the full application period opens to tell you if your project is invited to submit a full application. This will include an initial assessment of the ambient environment.</p>
            <p>2. If you submit an application, RPA will assess it against other projects and value for money. You will not automatically get a grant. The grant is expected to be highly competitive and you are competing against other projects.</p>
            <p>3. If your application is successful, you’ll be sent a funding agreement and can begin work on the project.</p>
            `,
            warning: {
              text: 'You must not start the project'
            },
            extraMessageContent: `<p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p> 
            <p>Before you start the project, you can:</p>
            <ul>
              <li>get quotes from suppliers</li>
              <li>apply for planning permission</li>
            </ul>
            <p class="govuk-body"><a class="govuk-link" href="${process.env.SURVEY_LINK}" target="_blank" rel="noopener noreferrer">What do you think of this service?</a></p>
            `
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        }
      ]
    }
  ]
}

const ALL_QUESTIONS = []
questionBank.sections.forEach(({ questions }) => {
  ALL_QUESTIONS.push(...questions)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach(item => ALL_URLS.push(item.url))

const YAR_KEYS = ['itemsTotalValue', 'remainingCost', 'calculatedGrant', 'remainingCostSolar', 'calculatedGrantSolar', 'remainingCostCalf', 'calculatedGrantCalf', 'yesStructureEligibility', 'calfHousingCost', 'SolarPVCost', 'calculatedGrantSolarPreCap']
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
