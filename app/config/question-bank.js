const { 
  PROJECT_COST_REGEX,
  NAME_ONLY_REGEX,
  WHOLE_NUMBER_REGEX,
  SBI_REGEX,
  MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER,
  EMAIL_REGEX,
  CHARS_MIN_10,
  PHONE_REGEX,
  ADDRESS_REGEX,
  MIN_3_LETTERS,
  ONLY_TEXT_REGEX,
  POSTCODE_REGEX,
  CURRENCY_FORMAT
} = require('ffc-grants-common-functionality').regex

const { LIST_COUNTIES } = require('ffc-grants-common-functionality').counties

const {
  MIN_GRANT,
  MAX_GRANT,
  VERANDA_MIN_GRANT,
  VERANDA_MAX_GRANT,
  GRANT_PERCENTAGE, 
  GRANT_PERCENTAGE_SOLAR
} = require('../helpers/grant-details')

/**
 * ----------------------------------------------------------------
 * list of yarKeys not bound to an answer, calculated separately
 * -  calculatedGrant
 * -  totalRemainingCost
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
          key: 'project-type',
          order: 10,
          title: 'What work are you doing to this building?',
          url: 'project-type',
          baseUrl: 'project-type',
          backUrl: 'start',
          nextUrl: 'applicant-type',
          hint: {
            html: `If you are applying for grant funding for multiple buildings, you must submit a separate application for each one`
          },
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">This grant is for:</p>
                      <ul>
                        <li>adding a veranda only to an existing laying hen or pullet building </li>
                        <li>refurbishing an existing laying hen or pullet building</li>
                        <li>replacing an entire laying hen or pullet building with a new building.</li>
                      </ul>
                </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `This grant is only for laying hen or pullet projects.\n
                The maximum grant funding each business can apply for is £500,000 for comprehensive projects, or £100,000 for veranda-only projects.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what work you are doing to this building'
            }
          ],
          answers: [
            {
              key: 'project-type-A1',
              value: 'Adding a veranda only to the existing building',
              hint: {
                text: 'The RPA will award veranda-only grant funding on a first come, first served basis'
              }
            },
            {
              key: 'project-type-A2',
              value: 'Refurbishing the existing building',
              hint: {
                text: 'A comprehensive project to upgrading an existing building by adding a mechanical ventilation, LED lighting and an aviary or multi-tier system where they do not have exist already'
              },
            },
            {
              key: 'project-type-A3',
              value: 'Replacing the entire building with a new building',
              hint: {
                text: 'A comprehensive project to include mechanical ventilation, LED lighting and an aviary or multi-tier system'
              },
            },
            {
              value: 'divider'
            },
            {
              key: 'project-type-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'projectType'
        },
        {
          key: 'applicant-type',
          order: 15,
          title: 'What type of farmer are you?',
          pageTitle: '',
          ga: { journeyStart: true },
          url: 'applicant-type',
          baseUrl: 'applicant-type',
          backUrl: 'project-type',
          nextUrl: 'legal-status',
          hint: {
            text: 'Select all that apply'
          },
          ineligibleContent: {
            messageContent: 'This grant is for laying hen or pullet farmers.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is for laying hen or pullet farmers.'
              }]
            }]
          },
          fundingPriorities: 'Improve the environment',
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of farmer you are'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'applicant-type',
                answerKey: 'applicant-type-A9'
              }
            }
          ],
          answers: [
            {
              key: 'applicant-type-A1',
              value: 'Laying hens (including pullets)'
            },
            {
              key: 'applicant-type-A2',
              value: 'Meat chickens',
              notEligible: true
            },
            {
              key: 'applicant-type-A3',
              value: 'Beef (including calf rearing)',
              notEligible: true
            },
            {
              key: 'applicant-type-A4',
              value: 'Dairy (including calf rearing)',
              notEligible: true
            },
            {
              key: 'applicant-type-A5',
              value: 'Pigs',
              notEligible: true
            },
            {
              key: 'applicant-type-A6',
              value: 'Sheep',
              notEligible: true
            },
            {
              key: 'applicant-type-A7',
              value: 'Aquaculture',
              notEligible: true
            },
            {
              key: 'applicant-type-A8',
              value: 'Horticulture',
              notEligible: true
            },
            {
              value: 'divider'
            },
            {
              key: 'applicant-type-A9',
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
          // preValidationKeys: ['applicantType'],
          ineligibleContent: {
            messageContent: 'Your business does not have an eligible legal status.',
            details: {
              summaryText: 'Who is eligible',
              html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
            },
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
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
            text: 'The site where the work will happen'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'planning-permission',
          url: 'country',
          baseUrl: 'country',
          // preValidationKeys: ['legalStatus'],
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' },
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
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
                para: `This grant is only for projects in England.
                
                Scotland, Wales and Northern Ireland have other grants available.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the planned project is in England'
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
          // preValidationKeys: ['inEngland'],
          ineligibleContent: {
            messageContent: 'You must have secured planning permission before you submit a full application.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          // fundingPriorities: 'Improving Adding Value',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `You must have secured planning permission before you submit a full application.

                        The application deadline is 31 December 2025.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if the project has planning permission'
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
          // preValidationKeys: ['planningPermission'],
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You must have secured planning permission before you submit a full application. The application deadline is 31 December 2025.',
            insertText: { text: '' },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
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
          // preValidationKeys: ['inEngland'],
          ineligibleContent: {
            messageContent: 'You cannot apply for a grant if you have already started work on the project.',
            insertText: { text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.' },
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
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
                
                Before you start the project you can:`,
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
              error: 'Select if you have already started work on the project'
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
          warning: {
            text: 'You must not start project work or commit to project costs before receiving your funding agreement.'
          },
          yarKey: 'projectStart'
        },
        {
          key: 'tenancy',
          order: 60,
          title: 'Is the planned project on land the business owns?',
          hint: {
            text: 'The site where the work will happen'
          },
          pageTitle: '',
          url: 'tenancy',
          baseUrl: 'tenancy',
          backUrl: 'project-started',
          nextUrl: 'poultry-type',
          // preValidationKeys: ['projectStart'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'If you are a tenant farmer, you have the option to ask your landlord to underwrite your agreement.'
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
              redirectUrl: 'project-responsibility'
            }
          ],
          yarKey: 'tenancy'
        },
        {
          key: 'project-responsibility',
          order: 65,
          title: 'Will you take full responsibility for your project?',
          hint: {
            html: `If you are on a short tenancy, you can ask your landlord to underwrite your agreement. This means they will take over your agreement if your tenancy ends.<br/><br/>
            This approach is optional and we will only ask for details at full application.`
          },
          pageTitle: '',
          url: 'project-responsibility',
          baseUrl: 'project-responsibility',
          backUrl: 'tenancy',
          nextUrl: 'poultry-type', 
          // routing TBC 
          // preValidationObject: {
          //   preValidationKeys: ['tenancy'],
          //   preValidationAnswer: ['tenancy-A2'],
          //   preValidationRule: 'AND',
          //   preValidationUrls: ['tenancy']
          // },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswercount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'You must complete your project and keep the grant-funded items fit for purpose for 5 years after the date you receive your final grant payment.',
                    items: []
                  }
                ],
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you will take full responsibility for your project'
            }
          ],
          answers: [
            {
              key: 'project-responsibility-A1',
              value: 'Yes, I plan to take full responsibility for my project'
            },
            {
              key: 'project-responsibility-A2',
              value: 'No, I plan to ask my landlord to underwrite my agreement'
            }
          ],
          yarKey: 'projectResponsibility'
        },
        {
          key: 'poultry-type',
          order: 80,
          title: 'What type of poultry will be housed in this building?',
          pageTitle: '',
          url: 'poultry-type',
          baseUrl: 'poultry-type',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A1'],
            urlOptions: {
              thenUrl: 'tenancy',
              elseUrl: 'project-responsibility'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'veranda-only-size',
              elseUrl: '1000-birds'
            }
          },
          ineligibleContent: {
            messageContent: 'This grant is only for laying hen or pullet projects.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is only for laying hens or pullet projects.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of poultry will be housed in the building'
            }
          ],
          answers: [
            {
              key: 'poultry-type-A1',
              text: 'Laying hens (over 17 weeks old)',
              value: 'hen',
              yarKeysReset: ['multiTierSystem']
            },
            {
              key: 'poultry-type-A2',
              text: 'Pullets (up to and including 17 weeks old)',
              value: 'pullet',
              yarKeysReset: ['henVeranda']
            },
            {
              value: 'divider'
            },
            {
              key: 'poultry-type-A3',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'poultryType'
        },
        {
          key: '1000-birds',
          order: 240,
          title: 'Are you the registered keeper of at least 1,000 {{_poultryType_}}?',
          pageTitle: '',
          url: '1000-birds',
          baseUrl: '1000-birds',
          backUrl: 'poultry-type',
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-veranda',
              elseUrl: 'building-items'
            }
          },
          // preValidationKeys: ['poultryType'],
          hint: {
            html: 'You must have housed at least 1,000 {{_poultryType_}} on your farm in the last 6 months'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must:',
                items: ['be the registered keeper of at least 1,000 {{_poultryType_}}', 'have housed at least 1,000 {{_poultryType_}} on your farm in the last 6 months.']
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">You must:</p>
                <ul class="govuk-list--bullet">
                    <li>be the registered keeper of at least 1,000 {{_poultryType_}}</li>
                    <li>have housed at least 1,000 {{_poultryType_}} on your farm in the last 6 months.</li>
                </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you are the registered keeper of at least 1,000 {{_poultryType_}}'
            }
          ],
          answers: [
            {
              key: '1000-birds-A1',
              value: 'Yes'
            },
            {
              key: '1000-birds-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'birdNumber'
        },
        {
          key: 'building-items',
          order: 80,
          title: 'Will the building have these features?',
          hint: {
            html: `
                  <p>When the project is complete, the building must have:</p>
                  <ul class="govuk-list--bullet">
                    <li>a fixed structure with a solid concrete floor</li>
                    <li>water-tight roof and walls</li>
                    <li>mesh capping applied to any roof or wall inlets and outlets 
                    capped with mesh (using a mesh hole size of 25 millimetres or 
                    less)</li>
                    <li>catch trays under all chimneys and roof-mounted vents</li>
                  </ul>`
          },
          pageTitle: '',
          url: 'building-items',
          baseUrl: 'building-items',
          backUrlObject: {
            dependentQuestionYarKey: 'henVeranda',
            dependentAnswerKeysArray: ['hen-veranda-A1'],
            urlOptions: {
              thenUrl: 'hen-veranda-features',
              elseUrl: 'hen-veranda',
              nonDependentUrl: '1000-birds'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A3'],
            urlOptions: {
              thenUrl: 'replacing-insulation',
              elseUrl: 'refurbishing-insulation',
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `When the project is complete, the building must have these biosecurity features.`
              }]
            }]
          },
          // preValidationKeys: ['poultryType'],
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                  <p class="govuk-body">When the project is complete, the building must have:</p>
                  <ul class="govuk-list--bullet">
                      <li>a fixed structure with a solid concrete floor</li>
                      <li>water-tight roof and walls</li>
                      <li>mesh capping applied to any roof or wall inlets 
                      and outlets capped with mesh (using a mesh hole 
                      size of 25 millimetres or less)</li>
                      <li>catch trays under all chimneys and roof-mounted vents.</li>
                  </ul>
              </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have these features'
            }
          ],
          answers: [
            {
              key: 'building-items-A1',
              value: 'Yes'
            },
            {
              key: 'building-items-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'buildingItems'
        },
        {
          key: 'refurbishing-insulation',
          order: 90,
          title: 'Will the building have full wall and roof insulation?',
          url: 'refurbishing-insulation',
          baseUrl: 'refurbishing-insulation',
          backUrl: 'building-items',
          nextUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'lighting-features',
              elseUrl: 'pullet-housing-requirements'
            }
          },
          ineligibleContent: {
            messageContent: 'When the project is complete. the building must have full wall and roof insulation.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'When the project is complete, the building must have full wall and roof insulation.',
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have full wall and roof insulation'
            }
          ],
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          answers: [
            {
              key: 'refurbishing-insulation-A1',
              value: 'Yes'
            },
            {
              key: 'refurbishing-insulation-A2',
              value: 'No',
              notEligible: true
            },
          ],
          yarKey: 'refurbishingInsulation'
        },
        {
          key: 'replacing-insulation',
          order: 95,
          title: 'Will the building have full wall and roof insulation?',
          url: 'replacing-insulation',
          baseUrl: 'replacing-insulation',
          backUrl: 'building-items',
          nextUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'lighting-features',
              elseUrl: 'pullet-housing-requirements'
            }
          },
          ineligibleContent: {
            messageContent: `The building must have full wall and roof insulation.<br/><br/>
            The new building must have wall and roof insulation with a U-Value of less than 0.3 watts per square metre, per degree Kelvin (0.3W/m²K).`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The new building must have wall and roof insulation with a U-Value of less than 0.3 watts per square metre, per degree Kelvin (0.3W/m²K).'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have full wall and roof insulation'
            }
          ],
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          answers: [
            {
              key: 'replacing-insulation-A1',
              value: 'Yes'
            },
            {
              key: 'replacing-insulation-A2',
              value: 'No',
              notEligible: true
            },
          ],
          yarKey: 'replacingInsulation'
        },
        {
          key: 'changing-area',
          order: 100,
          title: 'Will the building have a biosecurity changing area at each external pedestrian access point?',
          hint: {
            html: `
              <span>
                <p>Each biosecurity changing area must include:</p>
                <ul class="govuk-list--bullet">
                  <li>changing facilities, with a step-over barrier between the outer and inner areas</li>
                  <li>in the outer area, handwashing facilities with running water and storage for clothes and boots that you use outside of this building</li>
                  <li>in the inner area, a footbath and storage for clothes and boots that you use inside of the bird living area</li>
                </ul>
            </span>`
          },
          pageTitle: '',
          url: 'changing-area',
          baseUrl: 'changing-area',
          backUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'egg-store-access',
              elseUrl: 'concrete-apron'
            }
          },
          nextUrl: 'external-taps',
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The building must have a biosecurity changing area at each external pedestrian point. 

                If you're refurbishing an existing building and have limited internal space, you can add a shed onto the main entrance externally as a biosecurity changing area.`,
                items: []
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">
                  The building must have a biosecurity changing area at each external pedestrian point. 
                </p>
                <p class="govuk-body">Each biosecurity changing area must include:</p>
                <ul>
                  <li>changing facilities, with a step-over barrier between the outer and inner areas</li>
                  <li>in the outer area, handwashing facilities with running water and storage for clothes and boots you use outside this building</li>
                  <li>in the inner area, a footbath and storage for clothes and boots you use inside the bird living area.</li>
                </ul>
              </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have a biosecurity changing area'
            }
          ],
          answers: [
            {
              key: 'changing-area-A1',
              value: 'Yes'
            },
            {
              key: 'changing-area-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'changingArea'
        },
        {
          key: 'egg-store-access',
          order: 105,
          title: 'Will there be direct external access to the building’s egg store?',
          url: 'egg-store-access',
          baseUrl: 'egg-store-access',
          nextUrl: 'changing-area',
          backUrl: 'concrete-apron',
          // preValidationKeys: ['poultryType'],
          hint: {
            text: 'This must be separate from the main entrance lobby and connected changing area'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must be able to remove eggs and deliver empty egg trays to and from the building\'s egg store without going into the building\'s main entrance lobby or connected changing area.',
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
                <p class="govuk-body">
                You must be able to remove eggs and deliver empty egg trays to and from the hen housing's egg store without going into the entrance lobby or connected changing area.
                </p>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if there will be direct external access to the building’s to egg store'
            }
          ],
          answers: [
            {
              key: 'egg-store-access-A1',
              value: 'Yes'
            },
            {
              key: 'egg-store-access-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'eggStoreAccess'
        },
        {
          key: 'aviary-system',
          order: 110,
          title: 'Will the aviary system have these features?',
          url: 'aviary-system',
          baseUrl: 'aviary-system',
          backUrl: 'aviary-welfare',
          nextUrl: 'mechanical-ventilation',
          // preValidationKeys: ['poultryType'],
          hint: {
            html: `
                  <p>The aviary system must have integrated:</p>
                  <ul class="govuk-list--bullet">
                    <li>automatic manure removal belts</li>
                    <li>non-flicker LED lighting at each level (including under the system) capable of automatically simulating dawn and dusk</li>
                  </ul>`
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The aviary system must have integrated manure removal belts and a non-flicker LED lighting system to optimise the housing environment for the birds. `
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
              <p class="govuk-body">The aviary system must have integrated:</p>
              <ul class="govuk-list govuk-list--bullet">
                <li>manure removal belts</li>
                <li>integrated non-flicker LED lighting at each level (including under the system) capable of automatically simulating dawn and dusk.</li>
              </ul>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the aviary system will have these features'
            }
          ],
          answers: [
            {
              key: 'aviary-system-A1',
              value: 'Yes'
            },
            {
              key: 'aviary-system-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'aviarySystem'
        },
        {
          key: 'aviary-welfare',
          order: 115,
          title: 'Will the building have a high welfare aviary system?',
          pageTitle: '',
          url: 'aviary-welfare',
          baseUrl: 'aviary-welfare',
          backUrl: 'lighting-features',
          nextUrl: 'aviary-system',
          hint: {
            text: 'This system must enable the birds to move between levels without flying or jumping more than one metre in height'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The building must have a high welfare aviary system. 
                      
                      The aviary system must have welfare ramps and platforms if the hens would need to jump or fly more than one metre in height to move between levels.`,
                items: []
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'The building must have a high welfare laying hen aviary system',
            insertText: {
              text: 'You must not install a combi-cage system in your grant-funded housing.'
            },
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          warning: {
            text: 'You must not install a combi-cage system in your grant-funded housing.'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have a high welfare aviary system'
            }
          ],
          answers: [
            {
              key: 'aviary-welfare-A1',
              value: 'Yes'
            },
            {
              key: 'aviary-welfare-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'aviaryWelfare'
        },
        {
          key: 'hen-veranda-features',
          order: 122,
          title: 'Will the veranda have these features?',
          hint: {
            html: `
              <p>The veranda must have:</p>
              <ul class="govuk-list--bullet">
                <li>a solid concrete floor</li>
                <li>a waterproof insulated roof</li>
                <li>a dimmable LED lighting system between 0 lux and 60 lux</li>
                <li>a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access</li>
                <li>closable pop holes in the perimeter wall, unless the veranda is part of an indoor barn system</li>
                <li>internal access along the length of the wall of the hen house through closable pop holes that are at least 35cm high and 40cm wide</li>
                <li>a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down </li>
              </ul>`
          },
          pageTitle: '',
          url: 'hen-veranda-features',
          baseUrl: 'hen-veranda-features',
          backUrl: 'hen-veranda',
          nextUrl: 'building-items',
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The width of the pop hole openings along the length of the internal hen house wall must add up to a total of 2 metres for every 1,000 hens in the building.
                
                  The base of all pop holes must either:`,
                items: ['be less than 30cm from floor level', 'have access ramps that are as wide as the pop holes.'],
                additionalPara: 'You must not put perches in front of the pop holes.'
              }],
            }]
          },
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">The veranda must have:</p>
                <ul class="govuk-list--bullet">
                  <li>a solid concrete floor</li>
                  <li>a waterproof insulated roof</li>
                  <li>a dimmable LED lighting system between 0 lux and 60 lux</li>
                  <li>a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access</li>
                  <li>closable pop holes in the perimeter wall, unless the veranda is part of an indoor barn system</li>
                  <li>internal access along the length of the wall of the hen house through closable pop holes that are at least 35cm high and 40cm wide</li>
                  <li>a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down.</li>
                </ul>
              </div>
            `,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the veranda will have these features'
            }
          ],
          answers: [
            {
              key: 'hen-veranda-features-A1',
              value: 'Yes'
            },
            {
              key: 'hen-veranda-features-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'henVerandaFeatures'
        },
        {
          key: 'hen-veranda-biosecurity',
          order: 123,
          title: 'Will the veranda have the capacity to be made biosecure with mesh that has a spacing of 6mm or less?',
          hint: {
            text: 'This is to stop wild birds and rodents from entering during housing orders'
          },
          pageTitle: '',
          url: 'hen-veranda-biosecurity',
          baseUrl: 'hen-veranda-biosecurity',
          backUrl: 'hen-veranda-features',
          nextUrl: 'concrete-apron',
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must be able to make the veranda secure with mesh that has a spacing (aperture) of 6mm or less during disease driven housing orders.',
                items: []
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'The veranda must be capable of being secured with mesh (with a maximum of 6mm spacing) during disease driven housing orders.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the veranda will have the capacity to be made biosecure'
            }
          ],
          answers: [
            {
              key: 'hen-veranda-biosecurity-A1',
              value: 'Yes'
            },
            {
              key: 'hen-veranda-biosecurity-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'henVerandaBiosecurity'
        },
        {
          key: 'mechanical-ventilation',
          order: 124,
          title: 'Will the building have a mechanical ventilation system with these features?',
          hint: {
            html: `
              <span>
                <p>The mechanical ventilation system must have:</p>
                <ul class="govuk-list--bullet">
                  <li>a control system to automatically measure and record the daily temperature, humidity, and CO₂ levels</li>
                  <li>an alarm system (that detects excessive high or low temperatures and system failures) with a power supply independent of mains electricity</li>
                  <li>an emergency power supply, for example a high-capacity generator, in case of electrical or other failures.</li>
                </ul>
            </span>`
          },
          url: 'mechanical-ventilation',
          baseUrl: 'mechanical-ventilation',
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-ventilation-specification',
              elseUrl: 'pullet-ventilation-specification'
            }
          },
          backUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'aviary-system',
              elseUrl: 'housing-density'
            }
          },
          // preValidationKeys: ['poultryType'],
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">The mechanical ventilation system must have:</p>
                <ul>
                  <li>a control system to automatically measure and record the daily temperature, humidity, and CO₂ levels</li>
                  <li>an alarm system (that detects excessive high or low temperatures and system failures) with a power supply independent of mains electricity</li>
                  <li>an emergency power supply, for example a high-capacity generator, in case of electrical or other failures.</li>
                </ul>
                </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have a mechanical ventilation system with these features'
            }
          ],
          answers: [
            {
              key: 'mechanical-ventilation-A1',
              value: 'Yes'
            },
            {
              key: 'mechanical-ventilation-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'mechanicalVentilation'
        },
        {
          key: 'hen-ventilation-specification',
          order: 124,
          title: 'Will the ventilation system be fit for purpose in extreme heat?',
          hint: {
            html: `
                <p>In extreme heat, the ventilation system must be able to provide:</p>
                <ul class="govuk-list--bullet">
                  <li>an air speed of one metre per second over birds</li>
                  <li>a maximum ventilation rate of 10,800m³ per hour per 1000 birds</li>
                </ul>
                `
          },
          url: 'hen-ventilation-specification',
          baseUrl: 'hen-ventilation-specification',
          backUrl: 'mechanical-ventilation',
          nextUrl: 'concrete-apron',
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The ventilation system must be able to prevent the heat that the birds generate from increasing the house temperature by more than 3°C above the external ambient temperature.`
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
            <p class="govuk-body">In extreme heat, the ventilation system must be able to provide:</p>
              <div class="govuk-list govuk-list--bullet">
                <ul>
                  <li>an air speed of one metre per second over birds</li>
                  <li>a maximum ventilation rate of 10,800m³ per hour per 1000 birds.</li>
                </ul>
              </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the ventilation system will be fit for purpose in extreme heat'
            }
          ],
          answers: [
            {
              key: 'hen-ventilation-specification-A1',
              value: 'Yes'
            },
            {
              key: 'hen-ventilation-specification-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'henVentilationSpecification'
        },
        {
          key: 'hen-veranda',
          order: 121,
          title: 'Will the building have a veranda that is the required size?',
          url: 'hen-veranda',
          baseUrl: 'hen-veranda',
          hint: {
            html: `
            <p>When the project is complete, the building must have a veranda that is at least either:</p>
              <ul class="govuk-list--bullet">
                <li>4 metres wide along the length of the hen housing area</li>
                <li>30% of the indoor hen housing area footprint</li>
              </ul>`
          },
          backUrl: '1000-birds',
          nextUrl: 'hen-veranda-features',
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
            <p class="govuk-body">You must add a veranda if you have the required space.</p>
            <p>The veranda must be at least either:</p>
                  <ul>
                    <li>4 metres wide along the length of the hen housing area</li>
                    <li>30% of the indoor hen housing area footprint.</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `You must add a veranda if you have the required space.`,
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have a veranda that is the required size'
            }
          ],
          answers: [
            {
              key: 'hen-veranda-A1',
              value: 'Yes'
            },
            {
              key: 'hen-veranda-A2',
              value: 'No',
              notEligible: true
            },
            {
              value: 'divider'
            },
            {
              key: 'hen-veranda-A3',
              value: 'I do not have the outside space to add a veranda of this size',
              redirectUrl: 'building-items'
            }
          ],
          yarKey: 'henVeranda'
        },
        {
          key: 'pullet-ventilation-specification',
          order: 124,
          title: 'Will the ventilation system be fit for purpose in extreme heat?',
          hint: {
            html: `
                <p>In extreme heat, the ventilation system must be able to provide:</p>
                <ul class="govuk-list--bullet">
                  <li>an air speed of one metre per second over birds</li>
                  <li>a maximum ventilation rate of 9,000m³ per hour per 1000 birds</li>
                </ul>`
          },
          url: 'pullet-ventilation-specification',
          baseUrl: 'pullet-ventilation-specification',
          backUrl: 'mechanical-ventilation',
          nextUrl: 'concrete-apron',
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: `The ventilation system must be able to prevent the heat that the birds 
                  generate from increasing the house temperature by more than 3°C above the external ambient temperature.`
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">In extreme heat, the ventilation system must be able to provide:</p>
                <ul class="govuk-list--bullet">
                  <li>an air speed of one metre per second over birds</li>
                  <li>a maximum ventilation rate of 9,000m³ per hour per 1000 birds.</li>
                </ul>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the ventilation system will be fit for purpose in extreme heat'
            }
          ],
          answers: [
            {
              key: 'pullet-ventilation-specification-A1',
              value: 'Yes'
            },
            {
              key: 'pullet-ventilation-specification-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'pulletVentilationSpecification'
        },
        {
          key: 'lighting-features',
          order: 180,
          title: 'Will the house lighting system have these features?',
          pageTitle: '',
          url: 'lighting-features',
          baseUrl: 'lighting-features',
          backUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A2'],
            dependentElseUrlYarKey: 'projectType',
            dependentElseUrlQuestionKey: 'project-type',
            dependentElseUrlAnswerKey: 'project-type-A2',
            urlOptions: {
              thenUrl: 'pullet-housing-requirements',
              elseUrl: 'replacing-insulation',
              dependantElseUrl: 'refurbishing-insulation'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'aviary-welfare',
              elseUrl: 'multi-tier-system'
            }
          },
          hint: {
            html: `<p>When the project is complete, the house lighting system must have:</p>
                  <ul>
                      <li>non-flicker LED light with a colour temperature between 2700 and 4000 Kelvin</li>
                      <li>capacity for zonal dimming between 0 and 60 lux</li>
                      <li>full coverage of the entire floor-litter (scratch) area</li>
                      <span>{{_poultryType_}}</span>
                      <li>an option for red light to reduce feather pecking</li>
                  </ul>`
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
                  <p class="govuk-body">When the project is complete, the house lighting system must have:</p>
                  <ul>
                      <li>non-flicker LED light with a colour temperature between 2700 and 4000 Kelvin</li>
                      <li>capacity for zonal dimming between 0 and 60 lux</li>
                      <li>full coverage of the entire floor-litter (scratch) area</li>
                      <span>{{_poultryType_}}</span>
                      <li>an option for red light to reduce feather pecking.</li>
                  </ul>
              </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'When the project is complete. the house lighting system must have these features to promote positive bird behaviour and reduce stress.',
                  items: [],
                }]
              }
            ]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the house lighting system will have these features'
            }
          ],
          answers: [
            {
              key: 'lighting-features-A1',
              value: 'Yes'
            },
            {
              key: 'lighting-features-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'lightingFeatures'
        },
        {
          key: 'concrete-apron',
          order: 190,
          title: 'Will the structure be surrounded by a concrete apron?',
          pageTitle: '',
          url: 'concrete-apron',
          baseUrl: 'concrete-apron',
          backUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-ventilation-specification',
              elseUrl: 'pullet-ventilation-specification'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'egg-store-access',
              elseUrl: 'changing-area'
            }
          },
          hint: {
            text: 'This should be continuous, unless there needs to be a gap where birds have direct access to a range'
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'The building (and veranda if there is one) must have a concrete apron to help keep the area around the building clean and discourage nesting wildlife.',
                  items: [],
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: `<p class="govuk-body">The building (and veranda if there is one) must be surrounded by a concrete apron.</p>
            <p class="govuk-body">This should be continuous, unless there needs to be a gap where birds have direct access to range.</p>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the structure will be surrounded by a concrete apron'
            }
          ],
          answers: [
            {
              key: 'concrete-apron-A1',
              value: 'Yes'
            },
            {
              key: 'concrete-apron-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'concreteApron'
        },
        {
          key: 'housing-density',
          order: 200,
          title: 'Will the pullets be housed within this maximum stocking density when they are 16 weeks old?',
          pageTitle: '',
          url: 'housing-density',
          baseUrl: 'housing-density',
          backUrlObject: {
            dependentQuestionYarKey: 'multiTierSystem',
            dependentAnswerKeysArray: ['multi-tier-system-A1'],
            urlOptions: {
              thenUrl: 'rearing-aviary-system',
              elseUrl: 'step-up-system'
            }
          },
          nextUrl: 'mechanical-ventilation',
          hint: {
            html: `
            <p>To be eligible for grant funding, the maximum stocking density for multi-tier pullet housing at the age of 16 weeks must be within: </p>
              <ul class="govuk-list--bullet">
                <li>20kg per m² of the total usable area</li>
                <li>33kg per m² of the total usable area at floor level</li>
              </ul>`
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
            <p class="govuk-body">To be eligible for grant funding, the maximum stocking density for multi-tier pullet housing at the age of 16 weeks must be within:</p>
                  <ul>
                    <li>20kg per m² of the total usable area</li>
                    <li>33kg per m² of the total usable area at floor level</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the pullets will be housed within the maximum stocking density'
            }
          ],
          answers: [
            {
              key: 'housing-density-A1',
              value: 'Yes'
            },
            {
              key: 'housing-density-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'housingDensity'
        },
        {
          key: 'pullet-housing-requirements',
          order: 205,
          title: 'Will the pullet housing have these features?',
          pageTitle: '',
          url: 'pullet-housing-requirements',
          baseUrl: 'pullet-housing-requirements',
          backUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A3'],
            urlOptions: {
              thenUrl: 'replacing-insulation',
              elseUrl: 'refurbishing-insulation'
            }
          },
          nextUrl: 'lighting-features',
          hint: {
            html: `
                  <p>When the project is complete, the building must have:</p>
                  <ul class="govuk-list--bullet">
                      <li>a useable area at multiple bird-accessible heights from 10 days of age</li>
                      <li>height adjustable perches at equal to or more than 8cm per pullet</li>
                      <li>a minimum of 50% of the floor area available for litter</li>
                  </ul>
                `
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
            <p class="govuk-body">The pullet housing must have:</p>
                  <ul>
                    <li>a useable area at multiple bird-accessible heights from 10 days of age</li>
                    <li>height adjustable perches at equal to or more than 8cm per pullet</li>
                    <li>a minimum of 50% of the floor area available for litter.</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the pullet housing will have these features'
            }
          ],
          answers: [
            {
              key: 'pullet-housing-requirements-A1',
              value: 'Yes',
            },
            {
              key: 'pullet-housing-requirements-A2',
              value: 'No',
              notEligible: true
            },
          ],
          yarKey: 'pulletHousingRequirements'
        },
        {
          key: 'multi-tier-system',
          order: 210,
          title: 'Which multi-tier system will have the building have?',
          pageTitle: '',
          url: 'multi-tier-system',
          baseUrl: 'multi-tier-system',
          backUrl: 'lighting-features',
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'The building must have a multi-tier system so the pullets can move between levels without flying or jumping more than one metre in height, horizontally or vertically.',
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: 'The building must have a multi-tier system.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what multi-tier system the building will have'
            }
          ],
          answers: [
            {
              key: 'multi-tier-system-A1',
              value: 'Rearing aviary',
              redirectUrl: 'rearing-aviary-system',
              hint: {
                text: 'A system that houses birds within tiers during the first 2 weeks of rearing, that you can open to enable them to access the barn flow after 2 weeks'
              }
            },
            {
              key: 'multi-tier-system-A2',
              value: 'Step-up system',
              redirectUrl: 'step-up-system',
              hint: {
                text: 'A floor system that can change to match a rearing aviary post-brooding, with adjustable elevated tiers you can add and gradually raise as the birds grow'
              }
            },
            {
              value: 'divider'
            },
            {
              key: 'multi-tier-system-A3',
              value: 'None of the above',
              notEligible: true
            },
          ],
          yarKey: 'multiTierSystem'
        },
        {
          key: 'rearing-aviary-system',
          order: 215,
          title: 'Will the rearing aviary system have these features?',
          pageTitle: '',
          url: 'rearing-aviary-system',
          baseUrl: 'rearing-aviary-system',
          backUrl: 'multi-tier-system',
          nextUrl: 'housing-density',
          hint: {
            html: `
                <p>The rearing aviary system must have:</p>
                <ul>
                    <li>the capacity to provide or retain friable litter while the birds are held within the system</li>
                    <li>an integrated manure removal belt-system</li>
                    <li>integrated height-adjustable feed lines, nipple drinkers and platforms</li>
                    <li>integrated and fully dimmable non-flicker LED lighting</li>
                    <li>welfare ramps when the pullets are 14 days old</li>
                </ul>`
          },
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                    <p>The rearing aviary system must have:</p>
                    <ul>
                        <li>the capacity to provide or retain friable litter while the birds are held within the system</li>
                        <li>an integrated manure removal belt-system</li>
                        <li>integrated height-adjustable feed lines, nipple drinkers and platforms</li>
                        <li>integrated and fully dimmable non-flicker LED lighting</li>
                        <li>welfare ramps when the pullets are 14 days old</li>
                    </ul>
                </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the rearing aviary system will have these features'
            }
          ],
          answers: [
            {
              key: 'rearing-aviary-system-A1',
              value: 'Yes',
            },
            {
              key: 'rearing-aviary-system-A2',
              value: 'No',
              notEligible: true
            },
          ],
          yarKey: 'rearingAviarySystem'
        },
        {
          key: 'step-up-system',
          order: 220,
          title: 'Will the step-up system have these features?',
          pageTitle: '',
          url: 'step-up-system',
          baseUrl: 'step-up-system',
          backUrl: 'multi-tier-system',
          nextUrl: 'housing-density',
          hint: {
            html: `
                <p>The step-up system must have:</p>
                <ul>
                    <li>height-adjustable tiers with food and water that birds can access after 10 days</li>
                    <li>welfare ramps</li>
                </ul>`
          },
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                    <p>The step-up system must have:</p>
                    <ul>
                        <li>height-adjustable tiers with food and water that birds can access after 10 days</li>
                        <li>welfare ramps</li>
                    </ul>
                </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the step-up system will have these features'
            }
          ],
          answers: [
            {
              key: 'step-up-system-A1',
              value: 'Yes',
            },
            {
              key: 'step-up-system-A2',
              value: 'No',
              notEligible: true
            },
          ],
          yarKey: 'stepUpSystem'
        },
        {
          key: 'vehicle-washing',
          order: 230,
          title: 'Will there be a designated area for washing and disinfecting vehicles?',
          pageTitle: '',
          url: 'vehicle-washing',
          baseUrl: 'vehicle-washing',
          backUrl: 'external-taps',
          nextUrl: 'solar-PV-system',
          hint: {
            html: `
                  <p>This must be an area on site that includes:</p>
                  <ul class="govuk-list--bullet">
                    <li>a concrete surface that is appropriate to the size of the vehicles 
                    entering the facility (minimum width of 3 metres)</li>
                    <li>a drainage system and storage tanks for soiled water</li>
                  </ul>`
          },
          ineligibleContent: {
            messageContent: `
            <p class="govuk-body">There must be a designated washing and disinfecting area on site with:</p>
            <div class="govuk-list govuk-list--bullet">
                  <ul>
                    <li>a concrete surface that is appropriate to the size of the vehicles entering the facility (minimum width of 3 metres)</li>
                    <li>a drainage system and storage tanks for soiled water.</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if there will be a designated area for washing and disinfecting vehicles'
            }
          ],
          answers: [
            {
              key: 'vehicle-washing-A1',
              value: 'Yes'
            },
            {
              key: 'vehicle-washing-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'vehicleWashing'
        },
        {
          key: 'external-taps',
          order: 240,
          title: 'Will the building have an external tap at the main pedestrian access point?',
          pageTitle: '',
          url: 'external-taps',
          baseUrl: 'external-taps',
          backUrl: 'changing-area',
          nextUrl: 'vehicle-washing',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'There must be an external tap at the main pedestrian access point to manage external footbaths.'
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'There must be an external tap at the main pedestrian access point to manage external footbaths.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have an external tap at the main pedestrian access point'
            }
          ],
          answers: [
            {
              key: 'external-taps-A1',
              value: 'Yes'
            },
            {
              key: 'external-taps-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'externalTaps'
        },
        {
          key: 'solar-PV-system',
          order: 250,
          title: 'Will you buy a solar PV system for this building with this grant?',
          pageTitle: '',
          url: 'solar-PV-system',
          baseUrl: 'solar-PV-system',
          backUrl: 'vehicle-washing',
          nextUrl: 'project-cost',
          hint: {
            text: 'You have the option to buy and install a solar PV system with the grant. The solar PV panels must be installed on the roof of this building (or veranda if there is one)'
          },
          warning: {
            text: 'You cannot buy a Solar PV system with this grant if the roof of the building only faces north or is heavily shaded.',
            iconFallbackText: 'Warning'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You do not have to buy and install a solar PV system to be eligible for this grant.',
              }]
            }]
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you will buy a solar PV system for this building with this grant'
            }
          ],
          answers: [
            {
              key: 'solar-PV-system-A1',
              value: 'Yes',
              yarKeysReset: ['roofSupportSolarPV', 'roofSolarPVExemption', 'solarPVCost', 'solarBirdNumber', 
                              'solarCalculatedGrant', 'projectCost', 'totalRemainingCost']
            },
            {
              key: 'solar-PV-system-A2',
              value: 'No',
              redirectUrl: 'roof-solar-PV-exemption',
              yarKeysReset: ['solarPowerCapacity', 'solarPVCost', 'solarBirdNumber', 'solarCalculatedGrant', 
                              'projectCost', 'totalRemainingCost']
            }
          ],
          yarKey: 'solarPVSystem'
        },
        {
          key: 'roof-support-solar-PV',
          order: 245,
          title: 'Will the roof of this building be able to structurally support solar PV panels?',
          pageTitle: '',
          url: 'roof-support-solar-PV',
          baseUrl: 'roof-support-solar-PV',
          backUrl: 'roof-solar-PV-exemption',
          nextUrl: 'project-cost',
          hint: {
            html: `
            <p>Even if you are not installing a solar PV system, you must provide confirmation that the roof can support solar PV panels at full application.</p>
            <p>This confirmation must come from a building expert, contractor or structural engineer</p>`
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The roof must be able to support solar PV panels, allowing for potential use in the future.',
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `The roof of this building must be able to support solar PV panels, allowing for potential use in the future.`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the roof of this building will be able to structurally support solar PV panels'
            }
          ],
          answers: [
            {
              key: 'roof-support-solar-PV-A1',
              value: 'Yes'
            },
            {
              key: 'roof-support-solar-PV-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'roofSupportSolarPV'
        },
        {
          key: 'roof-solar-PV-exemption',
          order: 260,
          title: 'Which of these statements apply to this project?',
          url: 'roof-solar-PV-exemption',
          baseUrl: 'roof-solar-PV-exemption',
          backUrl: 'solar-PV-system',
          nextUrl: 'project-cost',
          preValidationKeys: '',
          hint: {
            text: 'Select all that apply'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The roof must be able to support solar PV panels, allowing for potential use in the future, unless any of these statements apply. `
              }]
            }]
          },
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select which of these statement apply to this project'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'roof-solar-PV-exemption',
                answerKey: 'roof-solar-PV-exemption-A7'
              }
            }
          ],
          answers: [
            {
              key: 'roof-solar-PV-exemption-A1',
              value: 'The building is listed',
              yarKeysReset: ['roofSupportSolarPV']
            },
            {
              key: 'roof-solar-PV-exemption-A2',
              value: 'The building is on a World Heritage Site',
              yarKeysReset: ['roofSupportSolarPV']
            },
            {
              key: 'roof-solar-PV-exemption-A3',
              value: 'I am not making changes to this building’s roof',
              dependantShowHideKey: 'project-type',
              dependantShowHideAnswerKey: 'project-type-A3',
              dependantShowHideYarKey: 'projectType',
              yarKeysReset: ['roofSupportSolarPV']
            },
            {
              key: 'roof-solar-PV-exemption-A4',
              value: 'The roof only faces north',
              yarKeysReset: ['roofSupportSolarPV']
            },
            {
              key: 'roof-solar-PV-exemption-A5',
              value: 'The roof is heavily shaded',
              yarKeysReset: ['roofSupportSolarPV']
            },
            {
              key: 'roof-solar-PV-exemption-A6',
              value: 'The roof does not have 100m² of clear roof space',
              yarKeysReset: ['roofSupportSolarPV']
            },
            {
              value: 'divider'
            },
            {
              key: 'roof-solar-PV-exemption-A7',
              value: 'None of the above',
              redirectUrl: 'roof-support-solar-PV'
            }
          ],
          yarKey: 'roofSolarPVExemption'
        },
        {
          key: 'veranda-only-size',
          order: 245,
          title: 'How big will the veranda be?',
          url: 'veranda-only-size',
          baseUrl: 'veranda-only-size',
          backUrl: 'poultry-type',
          nextUrl: 'veranda-features',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The veranda must be at least either:',
                items: ['4 metres wide along the length of the bird housing area', '30% of the size of the indoor bird housing area footprint.']
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">The veranda must be either:</p>
                <ul class="govuk-list--bullet">
                    <li>4 metres wide along the length of the bird housing area</li>
                    <li>30% of the size of the indoor bird housing area footprint.</li>
                </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how big the veranda will be'
            },
          ],
          answers: [
            {
              key: 'veranda-only-size-A1',
              value: '4 metres wide along the length of the bird housing area'
            },
            {
              key: 'veranda-only-size-A2',
              value: '30% of the size of the indoor bird housing area footprint'
            },
            {
              value: 'divider'
            },
            {
              key: 'veranda-only-size-A3',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'verandaOnlySize'
        },
        {
          key: 'veranda-features',
          order: 250,
          title: 'Will the veranda have these features?',
          pageTitle: '',
          url: 'veranda-features',
          baseUrl: 'veranda-features',
          backUrl: 'veranda-only-size',
          nextUrl: 'veranda-project-cost',
          hint: {
            html: `
              <p>The veranda must have a:</p>
              <ul class="govuk-list--bullet">
                <li>a solid concrete floor</li>
                <li>a waterproof insulated roof</li>
                <li>a dimmable LED lighting system between 0 lux and 60 lux</li>
                <li>a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access</li>
                <li>closable pop holes in the perimeter wall, unless the veranda is part of an indoor barn system</li>
                <li>internal access along the length of the wall of the hen house through closable pop holes that are at least 35cm high and 40cm wide</li>
                <li>a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down</li>
              </ul>`
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The width of the pop hole openings along the length of the hen house must add up to a total of 2 metres for every 1,000 hens in the building.
                
                      The base of all pop holes must either:`,
                items: ['be less than 30cm from floor level', 'have access ramps that are as wide as the pop holes.'],
                additionalPara: 'You must not put perches in front of the pop holes.'
              }],
            }]
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
              <p>The veranda must have a:</p>
              <ul>
                <li>a solid concrete floor</li>
                <li>a waterproof insulated roof</li>
                <li>a dimmable LED lighting system with a range between 0 lux and 60 lux</li>
                <li>a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access</li>
                <li>closable pop holes in the perimeter wall, unless the veranda is part of an indoor barn system</li>
                <li>internal access along the length of the wall of the hen house through closable pop holes that are at least 35cm high and 40cm wide</li>
                <li>a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down</li>
              </ul>
              </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the veranda will have these features'
            }
          ],
          answers: [
            {
              key: 'veranda-features-A1',
              value: 'Yes'
            },
            {
              key: 'veranda-features-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'verandaFeatures'
        },
        {
          key: 'veranda-project-cost',
          order: 265,
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'veranda-project-cost',
          baseUrl: 'veranda-project-cost',
          backUrl: 'veranda-features',
          nextUrl: 'veranda-potential-amount',
          fundingPriorities: '',
          preValidationKeys: [],
          grantInfo: {
            minGrant: VERANDA_MIN_GRANT,
            maxGrant: VERANDA_MAX_GRANT,
            grantPercentage: GRANT_PERCENTAGE,
            cappedGrant: true
          },
          type: 'input',
          prefix: {
            text: '£'
          },
          id: 'projectCost',
          label: {
            text: 'What is the estimated cost of the veranda?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'projectCost'
          },
          hint: {
            html: `
              <p>You can only apply for a grant of up to ${GRANT_PERCENTAGE}% of the estimated costs. The minimum grant you can apply for this project is £5,000 (${GRANT_PERCENTAGE}% of £12,500). The maximum grant is £100,000 (${GRANT_PERCENTAGE}% of £250,000).</p>
              <details class="govuk-details" data-module="govuk-details">
                <summary class="govuk-details__summary">
                  <span class="govuk-details__summary-text">
                    I am adding verandas to multiple buildings
                  </span>
                </summary>
                <div class="govuk-details__text">
                  <p>Enter the costs of adding this veranda only</p>
                  <p>You must submit a separate application for each veranda.</p>
                </div>
              </details>
              <p>Do not include VAT</p>
              <p>Enter amount, for example 50,000</p>
            `,
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the estimated cost of the veranda'
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
            messageContent: `You can apply for grant funding to add verandas to multiple buildings. You must submit a separate application for each veranda.</br></br>
            If the total grant funding for your combined veranda projects is more than £5,000 (${GRANT_PERCENTAGE}% of £12,500), you may still be eligible to apply for grant funding.</br></br>
            If you are applying for grant funding for a single veranda, you can <a href="https://www.gov.uk/government/organisations/rural-payments-agency"> see other grants you may be eligible for.</a>`,
            messageLink: {
              url: `veranda-potential-amount`,
              title: 'I am applying to add verandas to multiple buildings'
            },
          },    
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'veranda-potential-amount',
          order: 270,
          url: 'veranda-potential-amount',
          baseUrl: 'veranda-potential-amount',
          backUrl: 'veranda-project-cost',
          nextUrl: 'veranda-remaining-costs',
          // preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            potentialAmountConditional: false,
            messageHeader: 'Potential grant funding',
            additionalSentence: 'The maximum grant you can apply for is £100,000.',
            messageContent: 'You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.',
            insertText: { text: '' },
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'project-cost',
          order: 145,
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'project-cost',
          baseUrl: 'project-cost',
          backUrlObject: {
            dependentQuestionYarKey: 'roofSolarPVExemption' ,
            dependentAnswerKeysArray: ['roof-solar-PV-exemption-A7'],
            urlOptions: {
              thenUrl: 'roof-support-solar-PV',
              elseUrl: 'roof-solar-PV-exemption',
              nonDependentUrl: 'solar-PV-system'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: ['solarPVSystem'], 
            dependentAnswerKeysArray: ['solar-PV-system-A2'],
            urlOptions: {
              thenUrl: 'potential-amount',
              elseUrl: 'bird-number'
            }   
          },
          fundingPriorities: '',
          // preValidationKeys: [],
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
            text: 'What is the total estimated cost of {{_projectType_}} this building?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            htmlSolar: `
              <p>You can only apply for a grant of up to ${GRANT_PERCENTAGE}% of the estimated costs of {{_projectType_}} this building. Do not include the solar PV system costs in the estimated building project costs.</p>
              <details class="govuk-details">
                <summary class="govuk-details__summary">
                  <span class="govuk-details__summary-text">
                    I am replacing or refurbishing multiple buildings
                  </span>
                </summary>
                <div class="govuk-details__text">
                  <p>Enter the costs of {{_projectType_}} this building only.</p>
                  <p>You must submit a separate application for each building.</p>
                </div>
              </details>
              <p>Do not include VAT</p>
              <p>Enter amount, for example 595,000</p>
            `,
            htmlNoSolar: `
              <p>You can only apply for a grant of up to ${GRANT_PERCENTAGE}% of the estimated costs of {{_projectType_}} this building.</p>
              <details class="govuk-details">
                <summary class="govuk-details__summary">
                  <span class="govuk-details__summary-text">
                    I am replacing or refurbishing multiple buildings
                  </span>
                </summary>
                <div class="govuk-details__text">
                  <p>Enter the costs of {{_projectType_}} this building only.</p>
                  <p>You must submit a separate application for each building.</p>
                </div>
              </details>
              <p>Do not include VAT</p>
              <p>Enter amount, for example 595,000</p>
            `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the total estimated cost of {{_projectType_}} the building'
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
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The minimum grant each business can apply for is £15,000 (${GRANT_PERCENTAGE}% of £37,500). 
                
                The maximum total grant amount each business can apply for is £500,000 (${GRANT_PERCENTAGE}% of £1.25 million).`,
              }],
            }]
          },
          ineligibleContent: {
            messageContent: `You can apply for grant funding for multiple buildings. You must submit an application for each building.</br></br>
            If the total grant funding for your combined
            building projects is more than £15,000 (40% of £37,500), you may still be eligible to apply for grant funding.
           `,
           insertText: '',
            additionalPara: `If you are applying for grant funding for a single building, you can <a href="https://www.gov.uk/government/organisations/rural-payments-agency"> see other grants you may be eligible for.</a>`,
            messageLink: {
              url: 'potential-amount',
              title: 'I am applying for multiple building projects'
            },
          },
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'veranda-remaining-costs',
          order: 150,
          title: 'Can you pay the remaining costs of £{{_totalRemainingCost_}}?',
          pageTitle: '',
          url: 'veranda-remaining-costs',
          baseUrl: 'veranda-remaining-costs',
          backUrl: 'veranda-potential-amount',
          nextUrl: 'business-details',
          // preValidationKeys: ['projectCost'],
          ineligibleContent: {
            messageContent: `<p class="govuk-body">You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.</p>`,
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
                content: [
                  {
                    para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
                  You can use:`,
                    items: ['loans', 'overdrafts', 'the Basic Payment Scheme']
                  }
                ]
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
              key: 'veranda-remaining-costs-A1',
              value: 'Yes'
            },
            {
              key: 'veranda-remaining-costs-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'remainingCosts'
        },
        {
          key: 'potential-amount',
          order: 155,
          url: 'potential-amount',
          baseUrl: 'potential-amount',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          // preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.',
            insertText: { text: '' },
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'potential-amount-conditional',
          order: 160,
          url: 'potential-amount-conditional',
          baseUrl: 'potential-amount-conditional',
          backUrl: 'project-cost-solar',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You have requested the maximum grant amount of £500,000 for calf housing.',
            insertText: { text: '' },
            warning: {
              text: 'You cannot apply for funding for a solar PV system if you have requested the maximum funding amount for calf housing.'
            },
            extraMessageContent: '<p class="govuk-body">You can continue to check your eligibility for grant funding to build or upgrade calf housing.</p>'
          }
        },
        {
          key: 'potential-amount-solar',
          order: 165,
          url: 'potential-amount-solar',
          baseUrl: 'potential-amount-solar',
          backUrl: 'solar-power-capacity',
          nextUrl: 'remaining-costs',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: `You may be able to apply for a grant of up to £{{_totalCalculatedGrant_}}, based on the total estimated cost of £{{_totalProjectCost_}}.
              <div class="govuk-list">
                <p class="govuk-body">This grant amount combines:</p>
                <ul class="govuk-list--bullet">
                  <li>£{{_calculatedGrant_}} for building costs (${GRANT_PERCENTAGE}% of £{{_projectCost_}})</li>
                  <li>£{{_solarCalculatedGrant_}} for solar PV system costs (${GRANT_PERCENTAGE_SOLAR}% of £{{_solarProjectCost_}})</li>
                </ul>
              </div>
            `,
            insertText: { text: '' },
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'potential-amount-solar-capped',
          order: 165,
          url: 'potential-amount-solar-capped',
          baseUrl: 'potential-amount-solar-capped',
          backUrl: 'solar-power-capacity',
          nextUrl: 'remaining-costs',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: `You may be able to apply for a grant of up to £500,000, based on the total estimated cost of £{{_totalProjectCost_}}.
              <div class="govuk-list">
                <p class="govuk-body">This grant amount combines:</p>
                <ul class="govuk-list--bullet">
                  <li>£{{_calculatedGrant_}} for building costs (${GRANT_PERCENTAGE}% of £{{_projectCost_}})</li>
                  <li>£{{_cappedSolarProjectCost_}} for solar PV system costs</li>
                </ul>
              </div>
              <p class="govuk-body"> As building project costs take grant funding priority, you may be able to apply for a grant of up to £{{_cappedSolarProjectCost_}} for a solar PV system. The maximum grant is £500,000.<p/>
            `,
            insertText: { text: '' },
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'remaining-costs',
          order: 170,
          title: 'Can you pay the remaining costs of £{{_totalRemainingCost_}}?',
          pageTitle: '',
          url: 'remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'potential-amount',
          nextUrl: 'interruption-scoring',
          // preValidationKeys: ['projectCost'],
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
          key: 'current-system',
          order: 180,
          title: 'What type of {{_poultryType_}} housing system do you currently use in the building?',
          pageTitle: '',
          backUrl: 'interruption-scoring',
          nextUrl: 'current-multi-tier-system',
          url: 'current-system',
          baseUrl: 'current-system',
          // preValidationKeys: ['remainingCosts'],
          hint: {
            text: 'The housing system you are replacing or refurbishing for this project'
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA want to prioritise supporting farmers that are transitioning out of using colony cages.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of {{_poultryType_}} housing system you currently use'
            }
          ],
          answers: [
            {
              key: 'current-system-A1',
              value: 'Colony cage',
              redirectUrl: 'ramp-connection',
              yarKeysReset: ['currentMultiTierSystem']
            },
            {
              key: 'current-system-A2',
              value: 'Combi-cage',
              redirectUrl: 'ramp-connection',
              yarKeysReset: ['currentMultiTierSystem']
            },
            {
              key: 'current-system-A3',
              value: 'Barn'
            },
            {
              key: 'current-system-A4',
              value: 'Free range'
            },
            {
              key: 'current-system-A5',
              value: 'Organic'
            },
            {
              value: 'divider'
            },
            {
              key: 'current-system-A6',
              value: 'None of the above',
            }
          ],
          yarKey: 'currentSystem'
        },
        {
          key: 'current-multi-tier-system',
          order: 305,
          title: 'Does your building currently include [[_article_]] {{_poultryType_}} system?',
          hint: {
            text: 'The building you are replacing or refurbishing for this project'
          },
          url: 'current-multi-tier-system',
          baseUrl: 'current-multi-tier-system',
          nextUrl: 'ramp-connection',
          backUrl: 'current-system',
          // preValidationKeys: ['currentSystem'],
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA want to encourage investment in high welfare {{_poultryType_}} systems.',
              }]
            }]
          },
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your building currently includes [[_article_]] {{_poultryType_}} system'
            }
          ],
          answers: [
            {
              key: 'current-multi-tier-system-A1',
              value: 'Yes'
            },
            {
              key: 'current-multi-tier-system-A2',
              value: 'No'
            }
          ],
          yarKey: 'currentMultiTierSystem'
        },
        {
          key: 'tier-number',
          order: 190,
          title: 'How many tiers will be positioned directly above each other in the {{_poultryType_}} system?',
          pageTitle: '',
          url: 'tier-number',
          baseUrl: 'tier-number',
          backUrl: 'maximum-tier-height',
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-multi-tier',
              elseUrl: 'pullet-multi-tier'
            }
          },
          hint: {
            html: `The floor and the perches at the top of the {{_poultryType_}} system are not counted as tiers`
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund multi-tier systems that have 3 tiers or fewer directly above each other, to reduce the risk of keel bone fractures from collisions and falls.`
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how many tiers will be positioned directly above each other in the {{_poultryType_}} system'
            }
          ],
          answers: [
            {
              key: 'tier-number-A1',
              value: '3 tiers or fewer'
            },
            {
              key: 'tier-number-A2',
              value: '4 tiers or more'
            }
          ],
          yarKey: 'tierNumber'
        },
        {
          key: 'hen-multi-tier',
          order: 310,
          title: 'Will the hens in this building be reared in a multi-tier system as pullets?',
          url: 'hen-multi-tier',
          baseUrl: 'hen-multi-tier',
          backUrl: 'tier-number',
          nextUrl: 'natural-light',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund projects that encourage a consistent housing type for birds between rearing and laying. `
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the hens in this building will be reared in a multi-tier system as pullets'
            }
          ],
          answers: [
            {
              key: 'hen-multi-tier-A1',
              value: 'Yes'
            },
            {
              key: 'hen-multi-tier-A2',
              value: 'No'
            },
            {
              value: 'divider'
            },
            {
              key: 'hen-multi-tier-A3',
              value: 'I don’t know'
            }
          ],
          yarKey: 'henMultiTier'
        },
        {
          key: 'pullet-multi-tier',
          order: 315,
          title: 'Will the pullets reared in this building be housed in an aviary system as adults?',
          url: 'pullet-multi-tier',
          baseUrl: 'pullet-multi-tier',
          backUrl: 'tier-number',
          nextUrl: 'natural-light',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund projects that encourage a consistent housing type for birds between rearing and laying. `
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the pullets reared in this building will be housed in an aviary system as adults'
            }
          ],
          answers: [
            {
              key: 'pullet-multi-tier-A1',
              value: 'Yes'
            },
            {
              key: 'pullet-multi-tier-A2',
              value: 'No'
            },
            {
              value: 'divider'
            },
            {
              key: 'pullet-multi-tier-A3',
              value: 'I don’t know'
            }
          ],
          yarKey: 'pulletMultiTier'
        },
        {
          key: 'easy-grip-perches',
          order: 200,
          title:'Will the perches have a design feature that helps the birds grip the perches?',
          hint: {
            html: `You can replace {{_poultryType_}} standard circular metal perches with perches that have design features to help birds grip them (for example, a ridged surface, comfortable material or coating)`
          },
          url: 'easy-grip-perches',
          baseUrl: 'easy-grip-perches',
          backUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'natural-light',
              elseUrl: 'dark-brooders'
            }
          },
          nextUrl: 'building-biosecurity',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to support projects that ensure perches are easy to grip to increase bird safety and reduce falls.`
              }]
            }]
          },
          // preValidationKeys: ['naturalLight'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the perches will have a design feature that help the birds grip the perches'
            }
          ],
          answers: [
            {
              key: 'easy-grip-perches-A1',
              value: 'Yes'
            },
            {
              key: 'easy-grip-perches-A2',
              value: 'No'
            }
          ],
          yarKey: 'easyGripPerches'
        },
        {
          key: 'building-biosecurity',
          order: 210,
          title: 'Will the building structure include the following?',
          url: 'building-biosecurity',
          baseUrl: 'building-biosecurity',
          backUrl: 'easy-grip-perches',
          nextUrl: 'pollution-mitigation',
          hint: {
            text: 'Select all that apply'
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to support projects that include a high standard of biosecurity measures which protect against the spread of disease and infection.\n
                An integrated storage room can provide biosecure storage for items for the building such as litter, 
                enrichment items and welfare ramps.`
              }]
            }]
          },
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if the building structure will include the following'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'building-biosecurity',
                answerKey: 'building-biosecurity-A3'
              }
            }
          ],
          answers: [
            {
              key: 'building-biosecurity-A1',
              value: 'Shower facilities in the biosecurity changing area'
            },
            {
              key: 'building-biosecurity-A2',
              value: 'An integrated externally accessible storage room with a separate air space',
              hint: {
                text: `To create a separate air space, the area must have solid 
                ceiling height walls, providing a secure barrier from the 
                bird living area`
              }
            },
            {
              value: 'divider'
            },
            {
              key: 'building-biosecurity-A3',
              value: 'None of the above',
            }
          ],
          yarKey: 'buildingBiosecurity'
        },
        {
          key: 'ramp-connection',
          order: 285,
          title: 'When the project is complete, will every level of the {{_poultryType_}} system be connected to another level by a ramp?',
          pageTitle: '',
          url: 'ramp-connection',
          baseUrl: 'ramp-connection',
          backUrlObject: {
            dependentQuestionYarKey: 'currentSystem',
            dependentAnswerKeysArray: ['current-system-A1', 'current-system-A2'],
            urlOptions: {
              thenUrl: 'current-system',
              elseUrl: 'current-multi-tier-system'
            }
          },
          nextUrl: 'maximum-tier-height',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund {{_poultryType_}} systems that have ramps to reduce the risk of keel bone fractures and benefit birds that have keel bone fractures.`
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if every level of the {{_poultryType_}} system will be connected to another level by a ramp'
            }
          ],
          answers: [
            {
              key: 'ramp-connection-A1',
              value: 'Yes'
            },
            {
              key: 'ramp-connection-A2',
              value: 'No'
            }
          ],
          yarKey: 'rampConnection'
        },
        {
          key: 'maximum-tier-height',
          order: 290,
          title: 'Will the highest tier with direct access to the floor be 2 metres high or less?',
          pageTitle: '',
          hint: {
            text: 'Measured from the litter floor area to the underside of the manure belt'
          },
          url: 'maximum-tier-height',
          baseUrl: 'maximum-tier-height',
          backUrl: 'ramp-connection',
          nextUrl: 'tier-number',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund projects that prevent birds falling from heights of more than 2 metres, to reduce the risk of keel bone fractures.`
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the highest tier with direct access to the floor will be 2 metres high or less'
            }
          ],
          answers: [
            {
              key: 'maximum-tier-height-A1',
              value: 'Yes'
            },
            {
              key: 'maximum-tier-height-A2',
              value: 'No'
            }
          ],
          yarKey: 'maximumTierHeight'
        },
        {
          key: 'natural-light',
          order: 295,
          title: 'Will the building have windows that provide natural light to the indoor housing?',
          pageTitle: '',
          hint: {
            html: `
                  <p>The windows must be:</p>
                  <ul class="govuk-list--bullet">
                    <li>fitted with an insulated blind to manage light intensity and housing temperature</li>
                    <li>equal to at least 3% of size of the bird space footprint</li>
                  </ul>`
          },
          url: 'natural-light',
          baseUrl: 'natural-light',
          nextUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'easy-grip-perches',
              elseUrl: 'dark-brooders'
            }
          },
          backUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-multi-tier',
              elseUrl: 'pullet-multi-tier'
            }
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to support projects which provide indoor housing with natural light.
                      
                        Hens and pullets prefer natural light spectrums.
                      
                        Natural light can: 
                      `,
                items: ['promote positive, active behaviour', 'improved visibility to help reduce collisions between birds', 'increase range use.']
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have windows that provide natural light to the indoor housing'
            }
          ],
          answers: [
            {
              key: 'natural-light-A1',
              value: 'Yes'
            },
            {
              key: 'natural-light-A2',
              value: 'No'
            }
          ],
          yarKey: 'naturalLight'
        },
        {
          key: 'pollution-mitigation',
          order: 300,
          title: 'Will the building have any of the following?',
          pageTitle: '',
          url: 'pollution-mitigation',
          baseUrl: 'pollution-mitigation',
          backUrl: 'building-biosecurity',
          nextUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'renewable-energy',
              elseUrl: 'pullet-veranda-features'
            }
          },
          hint: {
            text: 'Select all that apply'
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA want to fund projects that improve biosecurity and use pollution mitigation practices.'
              }]
            }]
          },
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if the building will have any of the following'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'pollution-mitigation',
                answerKey: 'pollution-mitigation-A5'
              }
            }
          ],
          answers: [
            {
              key: 'pollution-mitigation-A1',
              value: 'Manure drying'
            },
            {
              key: 'pollution-mitigation-A2',
              value: 'Air filtration at inlets',
            },
            {
              key: 'pollution-mitigation-A3',
              value: 'Air filtration at outlets, for example using wet or dry scrubbers',
            },
            {
              key: 'pollution-mitigation-A4',
              value: 'A tree shelter belt near air outlets',
              hint: {
                text: 'Planted specifically to reduce ammonia output'
              }
            },
            {
              value: 'divider'
            },
            {
              key: 'pollution-mitigation-A5',
              value: 'None of the above',
            }
          ],
          yarKey: 'pollutionMitigation'
        },
        {
          key: 'pullet-veranda-features',
          order: 310,
          title: 'Will the building have a veranda with these features?',
          pageTitle: '',
          url: 'pullet-veranda-features',
          baseUrl: 'pullet-veranda-features',
          nextUrl: 'renewable-energy',
          backUrl: 'pollution-mitigation',
          hint: {
            html: `
              <div>
                <p>If you add a veranda to your building, it must:</p>
                <ul class="govuk-list--bullet">
                  <li>be at least 4 metres wide along the length of the pullet housing area, or equal to at least 30% of the indoor pullet housing area footprint</li>
                  <li>have a dimmable LED lighting system between 0 lux and 60 lux</li>
                  <li>have a solid concrete floor and waterproof insulated roof</li>
                  <li>have a perimeter wall, at least one metre high, that includes a biosecure entrance for cleaning access</li>
                  <li>have closable pop holes in the perimeter wall, unless the veranda forms part of an indoor barn system</li>
                  <li>have internal access along the length of the wall of the pullet house through closable pop holes that are at least 35cm high and 40cm wide</li>
                  <li>have a total of 2 metres of pop hole openings along the length of the pullet house for every 1,000 pullets in the building</li>
                  <li>have all pop holes less than 10cm from the floor level and have access ramps as wide as the pop holes that are higher than 10cm from the floor level</li>
                  <li>not have perches in front of the pop holes</li>
                  <li>have a mesh roller screen running underneath the length of the roof, that fits securely against the wall when you roll it down</li>
                </ul>
              </div>`
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA want to fund pullet housing that includes a veranda which meets the grant funding requirements.',
              }]
            }]
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the building will have a veranda with these features'
            }
          ],
          answers: [
            {
              key: 'pullet-veranda-features-A1',
              value: 'Yes'
            },
            {
              key: 'pullet-veranda-features-A2',
              value: 'No'
            }
          ],
          yarKey: 'pulletVerandaFeatures'
        },
        {
          key: 'dark-brooders',
          order: 320,
          title: 'Will the housing include dark boorders?',
          pageTitle: '',
          url: 'dark-brooders',
          baseUrl: 'dark-brooders',
          backUrl: 'pullet-veranda-features',
          nextUrl: 'renewable-energy',
          hint: { text: 'A suspended horizontal heat source enclosed by a curtain to exclude light'},
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{ para: 'RPA want to fund pullet housing that has dark brooders.'}]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the housing will include dark brooders'
            }
          ],
          answers: [
            {
              key: 'dark-brooders-A1',
              value: 'Yes',
            },
            {
              key: 'dark-brooders-A2',
              value: 'No'
            },
          ],
          yarKey: 'darkBrooders'
        },
        {
          key: 'renewable-energy',
          order: 325,
          title: 'Will the {{_poultryType_}} housing use renewable energy sources?',
          url: 'renewable-energy',
          baseUrl: 'renewable-energy',
          backUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'pollution-mitigation',
              elseUrl: 'pullet-veranda-features'
            }
          },
          nextUrl: 'bird-data-type',
          hint: {
            text: 'Select all that apply'
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA want to fund projects that use renewable energy.'
              }]
            }]
          },
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if the {{_poultryType_}} housing will use renewable energy sources'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'renewable-energy',
                answerKey: 'renewable-energy-A5'
              }
            },
            // {
            //   type: 'DEPENDENT_ANSWERS',
            //   error: 'Select one type of heat exchanger',
            //   questionKey: 'renewable-energy',
            //   dependentAnswerArray: ['renewable-energy-A2', 'renewable-energy-A3']
            // }
          ],
          answers: [
            {
              key: 'renewable-energy-A1',
              value: 'Solar PV system'
            },
            {
              key: 'renewable-energy-A2',
              value: 'A heat exchanger (heating only)',
            },
            {
              key: 'renewable-energy-A3',
              value: 'A heat exchanger (heating and cooling)',
            },
            {
              key: 'renewable-energy-A4',
              value: 'Biomass boiler',
            },
            {
              value: 'divider'
            },
            {
              key: 'renewable-energy-A5',
              value: 'None of the above',
            }
          ],
          yarKey: 'renewableEnergy'
        },
        {
          key: 'bird-data-type',
          order: 325,
          title: 'What poultry management data will you automatically collect and store?',
          pageTitle: '',
          url: 'bird-data-type',
          baseUrl: 'bird-data-type',
          backUrl: 'renewable-energy',
          nextUrl: 'environmental-data-type',
          hint: {
            html: `
                <p>Using digital systems</p>
                <p>Select all that apply</p>
            `
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA want to fund projects that have digital systems which automatically collect and store data for poultry management.'
              }]
            }]
          },
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what poultry management data you will automatically collect and store'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'bird-data-type',
                answerKey: 'bird-data-type-A10'
              }
            }
          ],
          answers: [
            {
              key: 'bird-data-type-A1',
              value: 'Bird location'
            },
            {
              key: 'bird-data-type-A2',
              value: 'Egg production parameters',
              dependantShowHideKey: 'poultry-type',
              dependantShowHideAnswerKey: 'poultry-type-A2',
              dependantShowHideYarKey: 'poultryType',
            },
            {
              key: 'bird-data-type-A3',
              value: 'Body weight',
            },
            {
              key: 'bird-data-type-A4',
              value: 'Disease detection',
            },
            {
              key: 'bird-data-type-A5',
              value: 'Feed date or conversion ratios'
            },
            {
              key: 'bird-data-type-A6',
              value: 'Locomotion or movement'
            },
            {
              key: 'bird-data-type-A7',
              value: 'Nest use',
              dependantShowHideKey: 'poultry-type',
              dependantShowHideAnswerKey: 'poultry-type-A2',
              dependantShowHideYarKey: 'poultryType',
            },
            {
              key: 'bird-data-type-A8',
              value: 'Sound analysis'
            },
            {
              key: 'bird-data-type-A9',
              value: 'Other'
            },
            {
              value: 'divider'
            },
            {
              key: 'bird-data-type-A10',
              value: 'None of the above',
            }
          ],
          yarKey: 'birdDataType'
        },
        {
          key: 'environmental-data-type',
          order: 330,
          title: 'What additional environmental data will you automatically collect and store?',
          pageTitle: '',
          url: 'environmental-data-type',
          baseUrl: 'environmental-data-type',
          backUrl: 'bird-data-type',
          nextUrl: 'score',
          hint: {
            html: `
                <p>Using digital systems</p>
                <p>Select all that apply</p>
            `
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA want to fund projects that have digital systems which automatically collect and store additional environmental data.'
              }]
            }]
          },
          type: 'multi-answer',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what additional environment data you will automatically collect and store'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'environmental-data-type',
                answerKey: 'environmental-data-type-A5'
              }
            }
          ],
          answers: [
            {
              key: 'environmental-data-type-A1',
              value: 'Ammonia'
            },
            {
              key: 'environmental-data-type-A2',
              value: 'Carbon monoxide'
            },
            {
              key: 'environmental-data-type-A3',
              value: 'Inhalable dust'
            },
            {
              key: 'environmental-data-type-A4',
              value: 'Other'
            },
            {
              value: 'divider'
            },
            {
              key: 'environmental-data-type-A5',
              value: 'None of the above',
            }
          ],
          yarKey: 'environmentalDataType'
        },
        {
          key: 'bird-number',
          order: 335,
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'bird-number',
          baseUrl: 'bird-number',
          backUrl: 'project-cost',
          nextUrl: 'solar-PV-cost',
          fundingPriorities: '',
          type: 'input',
          label: {
            text: `How many birds will {{_projectType_}} be able to house[[_extraClause_]]?`,
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
                  <p>The RPA want to fund a solar PV system with a power capacity that can support the building's high welfare features (lighting, ventilation system) for the amount of birds in the building.
                  </p>
                  <p>The power capacity for grant funding is 5 kilowatts (kW) per 1,000 birds.</p>
                  <p>Enter estimated amount, for example 8,000</p>
              `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter how many birds {{_projectType_}} will be able to house[[_extraClause_]]'
            },
            {
              type: 'REGEX',
              regex: CURRENCY_FORMAT,
              error: 'Number of birds should be a whole number, like 600'
            },
            {
              type: 'REGEX',
              regex: /^(0*[1-9][0-9]*(,\d{3})*)$/,
              error: 'Number of birds should be a number greater than 0'
            },
          ],
          yarKey: 'solarBirdNumber'
        },
        {
          key: 'solar-PV-cost',
          order: 340,
          classes: 'govuk-input--width-10',
          url: 'solar-PV-cost',
          baseUrl: 'solar-PV-cost',
          backUrl: 'bird-number',
          nextUrl: 'solar-power-capacity',
          preValidationKeys: [],
          grantInfo: {
            grantPercentage: GRANT_PERCENTAGE_SOLAR,
          },
          type: 'input',
          prefix: {
            text: '£'
          },
          grantInfo: {
            minGrant: 0,
            maxGrant: 500000,
            grantPercentage: 25,
            cappedGrant: true
          },
          id: 'solarPVCost',
          label: {
            text: 'What is the estimated cost of buying and installing the solar PV system?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'solarPVCost'
          },
          hint: {
            html: `
                  <p>You can apply for up to 25% of the estimated costs of buying and installing a solar PV system which has a power capacity of up to 5kW in energy output per 1,000 birds.</p>
                  <p>The maximum grant funding each business can apply for is £500,000 for building and solar PV system costs combined.</p>
                  <p>Enter estimated amount, for example 200,000</p>
              `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the estimated cost of buying and installing the solar PV system'
            },
            {
              type: 'REGEX',
              regex: /^[0-9,]+$/,
              error: 'Enter a whole number with a maximum of 7 digits'
            },
            {
              type: 'REGEX',
              regex: /^(0*[1-9][0-9]*(,\d{3})*)$/,
              error: 'Enter a whole number with a maximum of 7 digits'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999,
              error: 'Enter a whole number with a maximum of 7 digits'
            }
          ],
          yarKey: 'solarPVCost'
        },
        {
          key: 'solar-power-capacity',
          order: 350,
          classes: 'govuk-input--width-10',
          url: 'solar-power-capacity',
          baseUrl: 'solar-power-capacity',
          backUrl: 'solar-PV-cost',
          nextUrl: 'potential-amount-solar',
          preValidationKeys: [],
          type: 'input',
          prefix: {
            text: 'kW'
          },
          id: 'solarPowerCapacity',
          label: {
            text: 'What is the power capacity of the solar PV system?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'solarPowerCapacity'
          },
          hint: {
            html: `
                  <p>This grant will fund a solar PV system that has a power capacity of up to 5kW per 1,000 birds.</p>
                  <p>You can install a solar PV system that has a power capacity of more than 5kW of energy per 1,000 birds. You must fund the 
                  remaining solar PV system costs above the power capacity of 5kw per 1,000 birds. </p>
                  <p>Enter estimated power capacity, for example 10</p>
              `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the power capacity of the solar PV system'
            },
            {
              type: 'REGEX',
              // no special chars, only numbers, commas and dots
              regex:  /^[0-9,.]+$/,
              error: 'Estimated power capacity must be a number, like 10'
            },
            {
              // accepts numbers and commas with up to 2 decimal places
              type: 'REGEX',
              regex:  /^[0-9,]+(\.\d{1,2}){0,1}$/,
              error: 'Estimated power capacity must be a number up to 2 decimal places'
            },
            {
              // accepts numbers with correct format
              type: 'REGEX',
              regex: /^(\d{1,3}(\,{1}\d{3})*(\.\d{1,2}){0,1})*$/,
              error: 'Estimated power capacity must be a number, like 10'
            }
          ],
          yarKey: 'solarPowerCapacity'
        },
        {
          key: 'score',
          order: 175,
          title: 'Score results',
          url: 'score',
          baseUrl: 'score',
          backUrl: 'introducing-innovation',
          nextUrl: 'business-details',
          // preValidationKeys: ['introducingInnovation'],
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
            You’ll get an email with your answers and a reference number.</p>`,
            insertText: { text: '' }
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
          backUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'veranda-remaining-costs',
              elseUrl: 'project-type'
            }
          },
          nextUrl: 'applying',
          // preValidationKeys: [],
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
                text: 'For example Browns Hill Farm laying hens housing'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a project name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 30,
                  error: 'Project name must be 30 characters or fewer'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Project name must only include letters, hyphens, spaces and apostrophes'
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
                text: 'If you’re registered on the Rural Payments system, enter business name as registered'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 30,
                  error: 'Business name must be 30 characters or fewer'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Business name must only include letters, hyphens, spaces and apostrophes'
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
                  max: 9999999,
                  error: 'Number must be between 1-9999999'
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
              type: 'number',
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
          // preValidationKeys: ['businessDetails'],
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios govuk-fieldset__legend--l',
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
          key: 'applicant-details',
          order: 380,
          title: 'Applicant’s details',
          pageTitle: '',
          url: 'applicant-details',
          baseUrl: 'applicant-details',
          nextUrl: 'check-details',
          // preValidationKeys: ['applying'],
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
                  regex: MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER,
                  error: 'First name must include letters'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'First name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 30,
                  error: 'First name must be 30 characters or fewer'
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
                  regex: MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER,
                  error: 'Last name must include letters'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Last name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 30,
                  error: 'Last name must include letters'
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
                  type: 'NOT_EMPTY',
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
                  type: 'NOT_EMPTY',
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
                },
                {
                  type: 'REGEX',
                  regex: MIN_3_LETTERS,
                  error: 'Address must include at least 3 letters'
                },
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
                },
                {
                  type: 'REGEX',
                  regex: MIN_3_LETTERS,
                  error: 'Address must include at least 3 letters'
                },
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
                  regex: MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER,
                  error: 'Town must include letters'
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
          // preValidationKeys: ['applying'],
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
                  regex: MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER,
                  error: 'First name must include letters'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'First name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 30,
                  error: 'First name must be 30 characters or fewer'
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
                  regex: MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER,
                  error: 'Last name must include letters'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Last name must only include letters, hyphens and apostrophes'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 30,
                  error: 'Last name must include letters'
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
                  max: 30,
                  error: 'Name must be 30 characters or fewer'
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
                  type: 'NOT_EMPTY',
                  error: 'Enter a mobile phone number (if you do not have a mobile, enter your landline number)',
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
                  type: 'NOT_EMPTY',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile phone number)',
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
                },
                {
                  type: 'REGEX',
                  regex: MIN_3_LETTERS,
                  error: 'Address must include at least 3 letters'
                },
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
                },
                {
                  type: 'REGEX',
                  regex: MIN_3_LETTERS,
                  error: 'Address must include at least 3 letters'
                },
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
                  regex: MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER,
                  error: 'Town must include letters'
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
          nextUrlObject: {
            dependentQuestionYarKey: ['projectType'],
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'veranda-confirm',
              elseUrl: 'confirm'
            }
          },
          // preValidationKeys: ['applying'],
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
          // preValidationKeys: ['farmerDetails'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `I confirm that, to the best of my knowledge, the details I have provided are correct.</br></br>
            I understand the project’s eligibility and score is based on the answers I provided.</br></br>
            I am aware that the information I submit will be checked by the RPA.</br></br>
            I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.
            <h2 class="govuk-heading-m">Improving our schemes</h2>
            As we develop new services we get feedback from farmers and agents.</br></br>
            You may be contacted by us or a third party that we work with.`,
            insertText: { text: '' }
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
          key: 'veranda-confirm',
          title: 'Confirm and send',
          order: 410,
          url: 'veranda-confirm',
          backUrl: 'check-details',
          nextUrl: 'confirmation',
          // preValidationKeys: ['farmerDetails'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `I confirm that, to the best of my knowledge, the details I have provided are correct.</br></br>
            I understand the project’s eligibility and score is based on the answers I provided.</br></br>
            I am aware that the information I submit will be checked by the RPA.</br></br>
            I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.`,
            insertText: {
              text: 'I understand that the RPA will award the veranda-only grant funding on a first come, first served basis'
            },
            extraMessageContent: `<h2 class="govuk-heading-m">Improving our schemes</h2>
            As we develop new services we get feedback from farmers and agents.</br></br>
            You may be contacted by us or a third party that we work with`
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
          // preValidationKeys: ['farmerDetails'],
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
            middleWarning: {
              text: 'You must not start the project'
            },
            insertText: { text: '' },
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

const YAR_KEYS = ['totalRemainingCost', 'calculatedGrant']
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
