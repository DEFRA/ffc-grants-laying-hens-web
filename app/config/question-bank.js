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
  POSTCODE_REGEX
 } = require('ffc-grants-common-functionality').regex

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
          title: 'What type of poultry is the project for?',
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
            dependentAnswerKeysArray: ['project-type-A3'],
            urlOptions: {
              thenUrl: 'veranda-only',
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
                para: 'This grant is for replacing or refurbishing existing housing for laying hens or pullets.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what type of poultry the project is for'
            }
          ],
          answers: [
            {
              key: 'poultry-type-A1',
              text: 'Laying hens (over 15 weeks old)',
              value: 'hen',
              yarKeysReset: ['multiTierSystem']
            },
            {
              key: 'poultry-type-A2',
              text: 'Pullets (up to and including 15 weeks old)',
              value: 'pullet',
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
          title: 'Do you keep at least 1,000 {{_poultryType_}} on your farm currently?',
          hint: {
            text: 'This can be laying hens, pullets or both'
          },
          pageTitle: '',
          url: '1000-birds',
          baseUrl: '1000-birds',
          backUrl: 'poultry-type',
          nextUrl: 'building-items',
            // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must have at least 1,000 {{_poultryType_}} on your farm currently to be eligible for grant funding.'
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'You must keep at least 1,000 {{_poultryType_}} on your farm currently.',
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
              error: 'Select yes if you currently have at least 1,000 {{_poultryType_}} on your farm'
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
          title: 'Will the {{_poultryType_}} housing have these items?',
          hint: {
            html: `
                  <p>The building must have:</p>
                  <ul class="govuk-list--bullet">
                    <li>a fixed structure with a solid concrete floor</li>
                    <li>water-tight roof and walls</li>
                    <li>capped roof and wall inlets and outlets</li>
                    <li>catch trays under all chimneys and roof-mounted vents.</li>
                  </ul>`
          },
          pageTitle: '',
          url: 'building-items',
          baseUrl: 'building-items',
          backUrl: '1000-birds',
          nextUrl: 'capped-inlets-outlets',
          // preValidationKeys: ['birdNumber'],
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                  <p class="govuk-body">The building must have:</p>
                  <ul class="govuk-list--bullet">
                      <li>a fixed structure with a solid concrete floor</li>
                      <li>water-tight roof and walls</li>
                      <li>capped roof and wall inlets and outlets</li>
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
              error: 'Select yes if the {{_poultryType_}} housing will have these items'
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
          key: 'project-type',
          order: 70,
          title: 'What is your project?',
          url: 'project-type',
          baseUrl: 'project-type',
          backUrl: 'start',
          nextUrl: 'applicant-type',
          hint: {
            html: `If you want to apply for grant funding for multiple hen or 
                pullet housing projects, you must submit an application for each 
                project.<br/><br/>
                If you want to apply for multiple veranda projects you must 
                submit an application for each project.`
          },
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">This grant is only for:</p>
                      <ul>
                        <li>replacing an existing housing for laying hens or pullets</li>
                        <li>refurbishing existing housing for laying hens or pullets</li>
                        <li>adding a veranda to existing housing</li>
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
                para: 'You can apply for grant funding for either a housing project or adding a veranda only to existing housing.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what is your project'
            }
          ],
          answers: [
            {
              key: 'project-type-A1',
              value: 'Replacing existing housing'
            },
            {
              key: 'project-type-A2',
              value: 'Refurbishing existing housing'
            },
            {
              key: 'project-type-A3',
              value: 'Adding a veranda only to existing housing',
              hint: {
                text: 'The RPA will award the grant funding for adding a veranda only to existing housing on a first-come first-served basis'
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
          key: 'capped-inlets-outlets',
          order: 85,
          title: 'Will all roof and wall inlets and outlets be capped with mesh that has a spacing of 6 millimetres (mm) or less?',
          url: 'capped-inlets-outlets',
          baseUrl: 'capped-inlets-outlets',
          backUrl: 'building-items',
          nextUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'replacing-insulation',
              elseUrl: 'refurbishing-insulation'
            }
          },
          ineligibleContent: {
            messageContent: 'All roof and wall inlets and outlets must be capped with mesh that has a spacing of 6 millimetres (mm) or less.',
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
                para: 'The housing must have roof and wall inlets and outlets that are capped with mesh that has a spacing (aperture) of 6mm or less.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if all the roof and wall inlets and outlets will be capped'
            }
          ],
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          answers: [
            {
              key: 'capped-inlets-outlets-A1',
              value: 'Yes'
            },
            {
              key: 'capped-inlets-outlets-A2',
              value: 'No',
              notEligible: true
            },
          ],
          yarKey: 'cappedInletsOutlets'
        },
        {
          key: 'refurbishing-insulation',
          order: 90,
          title: 'Will the {{_poultryType_}} housing have full wall and roof insulation?',
          url: 'refurbishing-insulation',
          baseUrl: 'refurbishing-insulation',
          backUrl: 'capped-inlets-outlets',
          nextUrl: 'changing-area',
          ineligibleContent: {
            messageContent: 'The housing must have full wall and roof insulation.',
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
                para: 'The {{_poultryType_}} housing must have full wall and roof insulation. ',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the {{_poultryType_}} housing will have full wall and roof insulation'
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
          title: 'Will the {{_poultryType_}} housing have full wall and roof insulation, with a U-Value of less than 0.3W/m²/°C?',
          url: 'replacing-insulation',
          baseUrl: 'replacing-insulation',
          backUrl: 'capped-inlets-outlets',
          nextUrl: 'changing-area',
          ineligibleContent: {
            messageContent: 'The wall and roof insulation of the housing must have a U-Value of less than 0.3W/m²/°C.',
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
                para: `The wall and roof insulation of the {{_poultryType_}} housing must have a U- Value of less than 0.3W/m²/°C.

                The U-Value measures the rate of heat transfer from inside a building to outside.`,
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the {{_poultryType_}} housing will have full wall and roof insulation'
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
          title: 'Will the {{_poultryType_}} housing have a biosecure changing area at each external pedestrian access point?',
          hint: {
            html: `
              <span>
                <p>The building must have a biosecure changing area at each external pedestrian point with:</p>
                <ul class="govuk-list--bullet">
                  <li>changing facilities, divided by a floor-mounted physical barrier into a clean area and a dirty area</li>
                  <li>in the dirty area, handwashing facilities and storage for clothes and boots that you use outside of the housing</li>
                  <li>in the clean area, a footbath and storage for clothes and boots that you use inside of the shed</li>
                </ul>
            </span>`
          },
          pageTitle: '',
          url: 'changing-area',
          baseUrl: 'changing-area',
          backUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'replacing-insulation',
              elseUrl: 'refurbishing-insulation'
              // nonDependentUrl: 'solar-PV-system'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'egg-store-access',
              elseUrl: 'vaccination-lobby'
            }
          },
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The {{_poultryType_}} housing must have an effective hygiene barrier.

                If you're refurbishing an existing building and have limited internal space, you can add a shed onto the main entrance as a biosecure changing area.`,
                items: []
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">
                  The housing must have a biosecure changing area at each external pedestrian point with:
                </p>
                <ul>
                  <li>changing facilities, divided by a floor-mounted 
                  physical barrier into a clean area and a dirty area</li>
                  <li>in the dirty area, handwashing facilities and storage 
                  for clothes and boots that you use outside of the 
                  housing </li>
                  <li>in the clean area, a footbath and storage for 
                  clothes and boots that you use inside of the shed.</li>
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
              error: 'Select yes if the {{_poultryType_}} housing will have a biosecure changing area'
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
          title: 'Will there be direct external access to the egg store separate to the entrance lobby?',
          pageTitle: '',
          url: 'egg-store-access',
          baseUrl: 'egg-store-access',
          backUrl: 'changing-area',
          nextUrl: 'aviary-system',
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must be able to remove eggs and deliver empty egg trays to and from the building\'s egg store without going into the building\'s entrance lobby or connected changing area.',
                items: []
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
              error: 'Select yes if there will be direct external access to the egg store separate to the entrance lobby'
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
          title: 'Will the housing have a laying hen aviary system?',
          pageTitle: '',
          url: 'aviary-system',
          baseUrl: 'aviary-system',
          backUrl: 'egg-store-access',
          nextUrl: 'aviary-welfare',
          // preValidationKeys: ['poultryType'],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The housing must have a laying hen aviary system. 
                
                This cannot be a combi-cage aviary system.`,
                items: []
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
                <p class="govuk-body">
                The hen housing must have a laying hen aviary system.
                </p>`,
            insertText: {
              html: '<p>You must not install a combi-cage system in your grant-funded housing.</p>'
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
              error: 'Select yes if the housing will have a laying hen aviary system'
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
          title: 'Will the aviary system meet the manufacture\'s recommendation for high welfare?',
          pageTitle: '',
          url: 'aviary-welfare',
          baseUrl: 'aviary-welfare',
          backUrl: 'aviary-system',
          nextUrl: 'manure-removal',
          hint: {
            text: 'The birds must be able to move between levels without flying or jumping more than one metre in height'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The aviary system must either:',
                items: [`have welfare ramps and platforms in positions that meet the manufacturer's recommendation for a high welfare system`,
                  'be designed for hens to move between levels without ramps and platforms']
              }]
            }]
          },
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                <div class="govuk-body">The aviary system must either:</div>
                      <ul>
                        <li>have welfare ramps and platforms in positions that meet the manufacturer's recommendation for a high welfare system</li>
                        <li>be designed for hens to move between levels without ramps and platforms.</li>
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
              error: 'Select yes if the aviary system will meet the recommendation for high welfare'
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
          key: 'hen-veranda',
          order: 121,
          title: 'Will the housing have a veranda that is at least the same size as 30% of the indoor bird housing area footprint?',
          pageTitle: '',
          url: 'hen-veranda',
          baseUrl: 'hen-veranda',
          hint: {
            text: 'Housing projects that do not have access to an area at least 30% of the size of the indoor housing area are exempt from adding a veranda'
          },
          backUrl: 'lighting-features',
          nextUrl: 'hen-veranda-features',
          ineligibleContent: {
            messageContent: 'The housing must have a veranda that is at least the same size as 30% of the indoor bird housing area footprint in size.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `You must add a veranda that is at least the same size as 30% of the indoor bird housing area footprint.

                Housing projects that do not have access to an external area of at least 30% of the indoor housing area are exempt.
                
                You must exclude the veranda's floor area from calculations of stocking density (even if providing 24 hour access).`,
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if the housing will have a veranda that is at least the same size as 30% of the indoor bird housing area footprint'
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
              value: 'My project is exempt',
              redirectUrl: 'concrete-apron'
            }
          ],
          yarKey: 'henVeranda'
        },
        {
          key: 'hen-veranda-features',
          order: 122,
          title: 'Will the veranda have these features?',
          hint: {
            html: `
                  <p>The veranda of the housing must have:</p>
                  <ul class="govuk-list--bullet">
                    <li>a solid concrete floor</li>
                    <li>a waterproof insulated roof</li>
                    <li>guttering and a down-pipe to feed into the drainage system of the main building</li>
                    <li>a perimeter wall at least 1 metre high</li>
                    <li>lockable pop holes within the perimeter wall, unless the veranda forms part of an indoor barn system</li>
                    <li>mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended</li>
                    <li>a dimmable LED lighting system between 0 lux and 60 lux</li>
                  </ul>`
          },
          pageTitle: '',
          url: 'hen-veranda-features',
          baseUrl: 'hen-veranda-features',
          backUrl: 'hen-veranda',
          nextUrl: 'hen-veranda-biosecurity',
          // preValidationKeys: ['poultryType'],
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">The veranda of the housing must have:</p>
                <ul class="govuk-list--bullet">
                    <li>a solid concrete floor</li>
                    <li>a waterproof insulated roof</li>
                    <li>guttering and a down-pipe to feed into the drainage system of the main building</li>
                    <li>a perimeter wall at least 1 metre high</li>
                    <li>lockable pop holes in the perimeter wall, unless the veranda forms part of an indoor barn system</li>
                    <li>mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended</li>
                    <li>a dimmable LED lighting system between 0 lux and 60 lux</li>
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
          nextUrl: 'hen-pop-holes',
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
          title: 'Will the {{_poultryType_}} housing have a mechanical ventilation system with these features?',
          hint: {
            html: `
              <span>
                <p>The ventilation must have:</p>
                <ul class="govuk-list--bullet">
                  <li>a control system to automatically measure and record the daily temperature, humidity, and CO₂ levels</li>
                  <li>an alarm system (that detects excessive high or low temperatures and system failures) with a power supply independent of mains electricity</li>
                  <li>an emergency power supply, for example a high-capacity generator, in case of electrical or other failures</li>
                </ul>
            </span>`
          },
          pageTitle: '',
          url: 'mechanical-ventilation',
          baseUrl: 'mechanical-ventilation',
          backUrlObject: {
            dependentQuestionYarKey: ['multiTierSystem'],
            dependentAnswerKeysArray: ['multi-tier-system-A1'],
            urlOptions: {
              thenUrl: 'rearing-aviary-system',
              elseUrl: 'step-up-system',
              nonDependentUrl: 'aviary-lighting-system'
            }
          },
          nextUrl: 'ventilation-air-speed',
          // preValidationKeys: ['poultryType'],
          ineligibleContent: {
            messageContent: `
              <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">
                The ventilation must have:
                </p>
                <ul>
                <li>a control system to automatically measure and record the daily temperature, humidity, and CO₂ levels</li>
                <li>an alarm system (that detects excessive high or low temperatures and system failures) with a power supply independent of mains electricity</li>
                <li>an emergency power supply, for example a high-capacity generator, in case of electrical or other failures</li>
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
              error: 'Select yes if the {{_poultryType_}} housing will have a mechanical ventilation system with these features'
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
          key: 'ventilation-air-speed',
          order: 130,
          title: 'Will the {{_poultryType_}} housing ventilation be able to provide an air speed of 1 metre per second over birds?',
          pageTitle: '',
          url: 'ventilation-air-speed',
          baseUrl: 'ventilation-air-speed',
          backUrl: 'mechanical-ventilation',
          // preValidationKeys: ['poultryType'],
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-ventilation-rate',
              elseUrl: 'pullet-ventilation-rate'
            }
          },
          ineligibleContent: {
            messageContent: 'The housing ventilation must provide an air speed of 1 metre per second over birds.',
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
              error: 'Select yes if the {{_poultryType_}} housing ventilation will be able to provide an air speed of 1 metre per second over birds'
            }
          ],
          answers: [
            {
              key: 'ventilation-air-speed-A1',
              value: 'Yes'
            },
            {
              key: 'ventilation-air-speed-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'ventilationAirSpeed'
        },
        {
          key: 'hen-ventilation-rate',
          order: 135,
          title: 'Will the ventilation system be able to provide a ventilation rate (MXVR) of 10,800m³ per hour per 1000 hens?',
          pageTitle: '',
          url: 'hen-ventilation-rate',
          baseUrl: 'hen-ventilation-rate',
          backUrl: 'ventilation-air-speed',
          nextUrl: 'ventilation-air-quality',
          hint: {
            text: 'For birds up to 2.5kg in body mass'
          },
          ineligibleContent: {
            messageContent: 'The housing ventilation must have a ventilation rate of 10,800m³ per hour per 1000 hens.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The ventilation system must be able to provide a ventilation rate (MXVR) of 10,800m³ per hour per 1000 hens in the case of high heat scenarios.'
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
              error: 'Select yes if the ventilation system will meet the ventilation rate'
            }
          ],
          answers: [
            {
              key: 'hen-ventilation-rate-A1',
              value: 'Yes'
            },
            {
              key: 'hen-ventilation-rate-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'henVentilationRate'
        },
        {
          key: 'ventilation-air-quality',
          order: 140,
          title: 'Will the ventilation maintain the required air quality parameters?',
          pageTitle: '',
          url: 'ventilation-air-quality',
          baseUrl: 'ventilation-air-quality',
          backUrlObject: {
            dependentQuestionYarKey: 'poultryType',
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-ventilation-rate',
              elseUrl: 'pullet-ventilation-rate'
            }
          },
          nextUrl: 'lighting-system',
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">The ventilation must maintain air quality (at bird head height of less than 50cm) at a:</p>
                      <ul>
                        <li>carbon dioxide level of less than 3,000 parts per million (ppm)</li>
                        <li>percentage relative humidity (%rH) level of 40% to 70%</li>
                      </ul>
                </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          hint: {
            html: `
                <p>The ventilation must maintain air quality (at bird head height of less than 50cm) at a:</p>
                <ul class="govuk-list--bullet">
                    <li>carbon dioxide level of less than 3,000 parts per million (ppm)</li>
                    <li>percentage relative humidity (%rH) level of 40% to 70%</li>
                </ul>`
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the ventilation will maintain the required air quality parameters'
            }
          ],
          answers: [
            {
              key: 'ventilation-air-quality-A1',
              value: 'Yes'
            },
            {
              key: 'ventilation-air-quality-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'ventilationAirQuality'
        },
        {
          key: 'lighting-features',
          order: 180,
          title: 'Will the housing\'s lighting system have these features?',
          pageTitle: '',
          url: 'lighting-features',
          baseUrl: 'lighting-features',
          backUrl: 'lighting-system',
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
            dependentAnswerKeysArray: ['poultry-type-A1'],
            urlOptions: {
              thenUrl: 'hen-veranda',
              elseUrl: 'concrete-apron'
            }
          },
          hint: {
            html: `<p>The housing lighting system must have:</p>
                  <ul >
                      <li>the ability to provide an automatic stepped dawn and dusk lighting environment (unless this is already provided as part of an aviary lighting system)</li>
                      <li>an option for red light</li>
                      <li>a fail-safe standby device in case of electrical or other failures</li>
                  </ul>`
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
                  <p class="govuk-body">The housing lighting system must have:</p>
                  <ul>
                      <li>the ability to provide an automatic stepped dawn and dusk lighting environment (unless this is already provided as part of an aviary lighting system)</li>
                      <li>an option for red light</li>
                      <li>a fail-safe standby device in case of electrical or other failure</li>
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
              error: 'Select yes if the housing’s lighting system will have these features'
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
          key: 'hen-pop-holes',
          order: 185,
          title: 'Will the internal hen housing have lockable pop holes for the hens to enter the veranda through?',
          pageTitle: '',
          url: 'hen-pop-holes',
          baseUrl: 'hen-pop-holes',
          backUrl: 'hen-veranda-biosecurity',
          nextUrl: 'concrete-apron',
          hint: {
            text: 'You must not put perches in front of the pop holes'
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'Pop holes must:',
                  items: [
                      'be at least 35cm high and 40cm wide',
                      'extend along the entire length of the building',
                  ],
                  additionalPara: `
                  The pop hole openings must add up to a total of 2 metres for every 1,000 hens.

                  The base of all pop holes must either be less than 30cm from floor level, or have access ramps that are as wide as the pop holes.`
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: 
            `<p class="govuk-body">Pop holes must:</p>
                <ul class="govuk-list govuk-list--bullet">
                    <li>be at least 35cm high and 40cm wide</li>
                    <li>extend along the entire length of the building</li>
                </ul>
            <p class="govuk-body">The pop hole openings must add up to a total of 2 metres for every 1,000 hens.</p>`,
            insertText: {
              html: `
                  <p>The base of all pop holes must either be less than 30cm from floor level, or have access ramps that are as wide as the pop holes.</p>
                  <p>You must not put perches in front of the pop holes.</p>`    
            },
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
              error: 'Select yes if the internal hen housing will have lockable pop holes'
            }
          ],
          answers: [
            {
              key: 'hen-pop-holes-A1',
              value: 'Yes'
            },
            {
              key: 'hen-pop-holes-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'henPopHoles'
        },
        {
          key: 'concrete-apron',
          order: 190,
          title: 'Will the {{_poultryType_}} housing have a continuous concrete apron around its perimeter?',
          pageTitle: '',
          url: 'concrete-apron',
          baseUrl: 'concrete-apron',
          backUrlObject: {
            dependentQuestionYarKey: ['henVeranda'],
            dependentAnswerKeysArray: ['hen-veranda-A1'],
            urlOptions: {
              thenUrl: 'hen-pop-holes',
              elseUrl: 'hen-veranda',
              nonDependentUrl: 'lighting-features'
            }
          },
          nextUrl: 'vehicle-washing',
          hint: {
            text: 'This must include any veranda areas if there is no adjacent range, for example barn systems'
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'The {{_poultryType_}} housing and any barn-system veranda areas must be surrounded by a continuous concrete apron (a hardstanding concrete area).',
                  items: [],
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: 'The housing and any barn system veranda areas must be surrounded by a continuous concrete apron (a hardstanding concrete area).',
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
              error: 'Select yes if the {{_poultryType_}} housing will have a continuous concrete apron'
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
          key: 'vaccination-lobby',
          order: 195,
          title: 'Will there be a designated vaccination lobby with internal and external access?',
          pageTitle: '',
          url: 'vaccination-lobby',
          baseUrl: 'vaccination-lobby',
          backUrl: 'changing-area',
          nextUrl: 'housing-density',
          hint: {
            text: 'Internal access from the bird living area and external access from the loading bay'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The building must have a dedicated area to perform pullet vaccinations, with access to the loading bay.',
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'The housing must have a dedicated area to perform pullet vaccinations, with access to the loading bay.',
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
              error: 'Select yes if there will be a designated vaccination lobby'
            }
          ],
          answers: [
            {
              key: 'vaccination-lobby-A1',
              value: 'Yes'
            },
            {
              key: 'vaccination-lobby-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'vaccinationLobby'
        },
        {
          key: 'housing-density',
          order: 200,
          title: 'Will the pullets be housed at a maximum stocking density of 20kg per metres squared (m²) of the total usable area at 16 weeks of age?',
          pageTitle: '',
          url: 'housing-density',
          baseUrl: 'housing-density',
          backUrl: 'vaccination-lobby',
          nextUrl: 'pullet-housing-requirements',
          hint: {
            text: 'This must be 33kg per m² at floor level'
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'The maximum stocking density for multi-tier pullet housing at the age of 16 weeks is:',
                  items: ['20kg per m² of the total usable area', '33kg per m² of the total usable area at floor level'],
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
            <p class="govuk-body">The maximum stocking density for multi-tier pullet housing at the age of 16 weeks is:</p>
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
              error: 'Select yes if the pullets will be housed at a maximum stocking density'
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
          backUrl: 'housing-density',
          nextUrl: 'multi-tier-system',
          hint: {
            html: `
                  <p>The pullet housing must have:</p>
                  <ul class="govuk-list--bullet">
                      <li>a useable area provided over a range of bird-accessible heights from 10 days of age</li>
                      <li>height adjustable perches at equal to or more than 8cm per pullet</li>
                      <li>a minimum of 50% of the floor area covered in litter</li>
                  </ul>
                `
                },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
            <p class="govuk-body">The pullet housing must have:</p>
                  <ul>
                    <li>a useable area provided over a range of bird-accessible heights from 10 days of age</li>
                    <li>height adjustable perches at equal to or more than 8cm per pullet</li>
                    <li>a minimum of 50% of the floor area covered in litter</li>
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
          title: 'Which multi-tier system will the pullet housing have?',
          pageTitle: '',
          url: 'multi-tier-system',
          baseUrl: 'multi-tier-system',
          backUrl: 'pullet-housing-requirements',
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'The pullet housing must have a multi-tier system to enable the birds to transition between levels without flying or jumping more than 1m in height, horizontally or vertically.',
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: 'The pullet housing must have a multi-tier system.',
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
              error: 'Select what multi-tier system the pullet housing will have'
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
          title: 'Will your rearing aviary system have these features?',
          pageTitle: '',
          url: 'rearing-aviary-system',
          baseUrl: 'rearing-aviary-system',
          backUrl: 'multi-tier-system',
          nextUrl: 'mechanical-ventilation',
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
              error: 'Select yes if your rearing aviary system will have these features'
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
          title: 'Will your step-up system have these features?',
          pageTitle: '',
          url: 'step-up-system',
          baseUrl: 'step-up-system',
          backUrl: 'multi-tier-system',
          nextUrl: 'mechanical-ventilation',
          hint: {
            html: `
                <p>The step-up system must have:</p>
                <ul>
                    <li>height-adjustable tiers that may include food and water at, or before, 10 days</li>
                    <li>welfare ramps</li>
                </ul>`
          },
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                    <p>The step-up system must have:</p>
                    <ul>
                        <li>height-adjustable tiers that may include food and water at, or before, 10 days</li>
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
              error: 'Select yes if your step-up system will have these features'
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
          key: 'pullet-ventilation-rate',
          order: 225,
          title: 'Will the ventilation system be able to provide a ventilation rate (MXVR) of 9,000m³ per hour per 1000 pullets?',
          url: 'pullet-ventilation-rate',
          baseUrl: 'pullet-ventilation-rate',
          backUrl: 'ventilation-air-speed',
          nextUrl: 'ventilation-air-quality',
          hint: {
            text: 'For birds up to 2kg in body mass'
          },
          ineligibleContent: {
            messageContent: 'The housing ventilation must have a ventilation rate of 9,000m³ per hour per 1000 pullets.',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The ventilation system must be able to provide a ventilation rate (MXVR) of 9,000m³ per hour per 1000 pullets in the case of high heat scenarios.'
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
              error: 'Select yes if the ventilation system will meet the ventilation rate'
            }
          ],
          answers: [
            {
              key: 'pullet-ventilation-rate-A1',
              value: 'Yes'
            },
            {
              key: 'pullet-ventilation-rate-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'pulletVentilationRate'
        },
        {
          key: 'vehicle-washing',
          order: 230,
          title: 'Will the {{_poultryType_}} housing have a designated area for washing and disinfecting vehicles?',
          pageTitle: '',
          url: 'vehicle-washing',
          baseUrl: 'vehicle-washing',
          backUrl: 'concrete-apron',
          nextUrl: 'soiled-water-drainage',
          hint: {
            text: 'This must include an area of concrete parking which is appropriate to the size of the vehicles entering the facility (minimum width of 3 metres)'
          },
          ineligibleContent: {
            messageContent: 'There must be a designated washing and disinfecting area for vehicles entering the facility.',
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
              error: 'Select yes if the {{_poultryType_}} housing will have a designated area for washing and disinfecting vehicles'
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
          key: 'soiled-water-drainage',
          order: 235,
          title: 'Will the designated washing and disinfecting area have the drainage system and storage tanks for soiled water?',
          pageTitle: '',
          url: 'soiled-water-drainage',
          baseUrl: 'soiled-water-drainage',
          backUrl: 'vehicle-washing',
          nextUrl: 'external-taps',
          hint: {
            text: 'This is separate from rainwater drainage'
          },
          ineligibleContent: {
            messageContent: 'The designated washing and disinfecting area must have a drainage system and storage tanks for soiled water.',
            insertText: {
              text: 'This is separate from rainwater drainage.'
            },
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
              error: 'Select yes if the designated washing and disinfecting area will have a drainage system and storage tanks'
            }
          ],
          answers: [
            {
              key: 'soiled-water-drainage-A1',
              value: 'Yes'
            },
            {
              key: 'soiled-water-drainage-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'soiledWaterDrainage'
        },
        {
          key: 'external-taps',
          order: 240,
          title: 'Will the {{_poultryType_}} housing have an external tap at each main pedestrian access point?',
          pageTitle: '',
          url: 'external-taps',
          baseUrl: 'external-taps',
          backUrl: 'soiled-water-drainage',
          nextUrl: 'roof-solar-PV',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'There must be an external tap to manage external footbaths at every pedestrian access point to the housing.'
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'There must be an external tap to manage external footbaths at every pedestrian access point to the housing.',
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
              error: 'Select yes if the {{_poultryType_}} housing will have an external tap at each main pedestrian access point'
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
          key: 'veranda-only',
          order: 245,
          title: 'Will the veranda be at least the same size as 30% of the indoor bird housing area footprint?',
          pageTitle: '',
          url: 'veranda-only',
          baseUrl: 'veranda-only',
          backUrl: 'poultry-type',
          nextUrl: 'veranda-features',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `The veranda must be at least the same size as 30% of the indoor bird housing area footprint. 
                
                You must exclude the veranda's floor area from calculations of stocking density (even if providing 24 hour access).`
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'The veranda must be at least the same size as 30% of the indoor bird housing area footprint in size.',
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
              error: 'Select yes if the veranda will be at least the same size as 30% of the indoor bird housing area footprint'
            }
          ],
          answers: [
            {
              key: 'veranda-only-A1',
              value: 'Yes'
            },
            {
              key: 'veranda-only-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'verandaOnly'
        },
        {
          key: 'veranda-features',
          order: 250,
          title: 'Will the veranda have these features?',
          pageTitle: '',
          url: 'veranda-features',
          baseUrl: 'veranda-features',
          backUrl: 'veranda-only',
          nextUrl: 'veranda-biosecurity',
          hint: {
            html: `
                  <p>The veranda of the housing must have:</p>
                  <ul class="govuk-list--bullet">
                    <li>a solid concrete floor</li>
                    <li>a waterproof insulated roof</li>
                    <li>guttering and a down-pipe to feed into the drainage system of the main building</li>
                    <li>a perimeter wall at least 1 metre high</li>
                    <li>lockable pop holes within the perimeter wall, unless the veranda forms part of an indoor barn system</li>
                    <li>mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended</li>
                    <li>a dimmable LED lighting system between 0 lux and 60 lux</li>
                  </ul>`
          },
          ineligibleContent: {
            messageContent: `
                <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">The veranda of the housing must have:</p>
                      <ul>
                        <li>a solid concrete floor</li>
                        <li>a waterproof insulated roof</li>
                        <li>guttering and a down-pipe to feed into the drainage system of the main building</li>
                        <li>a perimeter wall at least 1 metre high</li>
                        <li>lockable pop holes in the perimeter wall, unless the veranda forms part of an indoor barn system</li>
                        <li>mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended</li>
                        <li>a dimmable LED lighting system between 0 lux and 60 lux.</li>
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
          key: 'veranda-biosecurity',
          order: 255,
          title: 'Will the veranda have the capacity to be made biosecure with mesh that has a spacing of 6mm or less?',
          pageTitle: '',
          url: 'veranda-biosecurity',
          baseUrl: 'veranda-biosecurity',
          backUrl: 'veranda-features',
          nextUrl: 'veranda-pop-holes',
          hint: {
            text: 'This is to stop wild birds and rodents from entering during housing orders'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `You must be able to make the veranda secure with mesh that has a spacing (aperture) of 6mm or less during housing orders.`
              }]
            }]
          },
          ineligibleContent: {
            messageContent: 'The veranda must be capable of being secured with mesh (with a maximum of 6mm spacing) during housing orders.',
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
              key: 'veranda-biosecurity-A1',
              value: 'Yes'
            },
            {
              key: 'veranda-biosecurity-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'verandaBiosecurity'
        },
        {
          key: 'veranda-pop-holes',
          order: 260,
          title: 'Will the internal {{_poultryType_}} housing have lockable pop holes for the hens to enter the veranda through?',
          pageTitle: '',
          url: 'veranda-pop-holes',
          baseUrl: 'veranda-pop-holes',
          backUrl: 'veranda-biosecurity',
          nextUrl: 'veranda-project-cost',
          hint: {
            text: 'You must not put perches in front of the pop holes'
          },
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'Pop holes must:',
                  items: [
                      'be at least 35cm high and 40cm wide',
                      'extend along the entire length of the building',
                  ],
                  additionalPara: `
                  The pop hole openings must add up to a total of 2 metres for every 1,000 hens.

                  The base of all pop holes must either be less than 30cm from floor level, or have access ramps that are as wide as the pop holes.`
                }]
              }
            ]
          },
          ineligibleContent: {
            messageContent: `
            <div class="govuk-list govuk-list--bullet">
                <p class="govuk-body">Pop holes must:</p>
                <ul>
                    <li>be at least 35cm high and 40cm wide</li>
                    <li>extend along the entire length of the building</li>
                </ul>
                <p>The pop hole openings must add up to a total of 2 metres for every 1,000 hens.</p>
            </div>`,
            insertText: {
              html: `
                  <p>The base of all pop holes must either be less than 30cm from floor level, or have access ramps that are as wide as the pop holes.</p>
                  <p>You must not put perches in front of the pop holes.</p>
              `
            },
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
              error: 'Select yes if the internal {{_poultryType_}} housing will have lockable pop holes'
            }
          ],
          answers: [
            {
              key: 'veranda-pop-holes-A1',
              value: 'Yes'
            },
            {
              key: 'veranda-pop-holes-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'verandaPopHoles'
        },
        {
          key: 'veranda-project-cost',
          order: 265,
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'veranda-project-cost',
          baseUrl: 'veranda-project-cost',
          backUrl: 'veranda-pop-holes',
          nextUrl: 'veranda-potential-amount',
          fundingPriorities: '',
          preValidationKeys: [],
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
          id: 'projectCost',
          label: {
            text: 'What is the total estimated cost of the veranda project?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'projectCost'
          },
          hint: {
            html: `
                  <p>You can only apply for a grant of up to 40% of the estimated costs. The minimum grant you can apply for this project is £5,000 (40% of £12,500). The maximum grant is £100,000.</p>
                  <p>Do not include VAT</p>
                  <p>Enter amount, for example 50,000</p>
              `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the total estimated cost of the veranda project'
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
            messageContent: 'The minimum grant you can apply for veranda project costs is £5,000 (40% of £12,500).',
            messageLink: {
              url: 'https://www.gov.uk/government/organisations/rural-payments-agency',
              title: 'See other grants you may be eligible for.'
            }
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
          backUrl: 'project-type',
          // backUrlObject: {
          //   dependentQuestionYarKey: 'heritageSite',
          //   dependentAnswerKeysArray: ['heritage-site-A2'],
          //   urlOptions: {
          //     thenUrl: 'heritage-site',
          //     elseUrl: 'solar-PV-system',
          //     nonDependentUrl: 'solar-PV-system'
          //   }
          // },
          nextUrl: 'potential-amount',
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
            text: 'What is the total estimated cost of the calf housing?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
                  <p>You can only apply for a grant of up to 40% of the estimated costs. The minimum grant you can apply for this project is £15,000 (40% of £37,500). The maximum grant is £500,000.</p>
                  <p>Do not include VAT</p>
                  <p>Enter amount, for example 95,000</p>
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
          key: 'veranda-remaining-costs',
          order: 150,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
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
            warning: {
              text: 'You cannot apply for funding for a solar PV system if you have requested the maximum funding amount for calf housing.'
            },
            extraMessageContent: '<p class="govuk-body">You can continue to check your eligibility for grant funding to build or upgrade calf housing.</p>'
          }
        },
        {
          key: 'potential-amount-capped',
          order: 165,
          url: 'potential-amount-capped',
          baseUrl: 'potential-amount-capped',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          // preValidationKeys: ['projectCost'],
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
          key: 'remaining-costs',
          order: 170,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'potential-amount',
          nextUrl: 'housing',
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
          backUrl: 'remaining-costs',
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
              redirectUrl: 'ramp-connection'
            },
            {
              key: 'current-system-A2',
              value: 'Combi-cage'
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
              key: 'legal-status-A5',
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
          key: 'three-tiers',
          order: 190,
          title: 'Will the multi-tier system have 3 tiers or fewer directly above each other?',
          pageTitle: '',
          url: 'three-tiers',
          baseUrl: 'three-tiers',
          backUrl: 'maximum-tier-height',
          nextUrlObject: {
            dependentQuestionYarKey: ['poultryType'],
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
                para: `RPA want to fund multi-tier systems that have 3 tiers or fewer directly above each other, to reduce the risk of keel bone fractures from collisions and falls.`
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
              error: 'Select yes if the multi-tier system will have 3 tiers or fewer directly above each other'
            }
          ],
          answers: [
            {
              key: 'three-tiers-A1',
              value: 'Yes'
            },
            {
              key: 'three-tiers-A2',
              value: 'No'
            }
          ],
          yarKey: 'threeTiers'
        },
        {
          key: 'hen-multi-tier',
          order: 310,
          title: 'Will the hens in your grant-funded building be reared in a multi-tier system as pullets?',
          pageTitle: '',
          hint: {
            text: 'When they are under 15 weeks old'
          },
          url: 'hen-multi-tier',
          baseUrl: 'hen-multi-tier',
          backUrl: 'three-tiers',
          nextUrl: 'natural-light',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund projects where pullets are reared in multi-tier aviary systems before they move into the grant-funded aviary housing as layer hens.`
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
              error: 'Select yes if the hens in your grant-funded building will be reared in a multi-tier system as pullets'
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
              value: 'I don\'t know'
            }
          ],
          yarKey: 'henMultiTier'
        },
        {
          key: 'pullet-multi-tier',
          order: 315,
          title: 'Will the pullets in your grant-funded building live in a multi-tier system as hens?',
          pageTitle: '',
          hint: {
            text: 'When they are over 15 weeks old'
          },
          url: 'pullet-multi-tier',
          baseUrl: 'pullet-multi-tier',
          backUrl: 'three-tiers',
          nextUrl: 'natural-light',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund projects that will house hens in multi-tier aviary systems when they move out of the grant-funded housing.`
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
              error: 'Select yes if the pullets in your grant-funded building will live in a multi-tier system as hens'
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
              value: 'I don\'t know'
            }
          ],
          yarKey: 'pulletMultiTier'
        },
        {
          key: 'easy-grip-perches',
          order: 200,
          title:'Will the perches have a design feature that help the {{_poultryType_}} grip the perches?',
          hint: {
            text: 'For example, sufficient grip size or a comfortable material coating'
          },
          pageTitle: '',
          url: 'easy-grip-perches',
          baseUrl: 'easy-grip-perches',
          backUrl: 'natural-light',
          nextUrl: 'building-biosecurity',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to support projects which provide perches that are easy to grip to increase bird safety and reduce falls.`
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
              error: 'Select yes if the perches will have a design feature that help the {{_poultryType_}} grip the perches'
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
                para: `RPA want to support projects that include a high standard of biosecurity measures 
                which protect against the spread of disease and infection.\n
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
              value: 'Shower-in-facilities in the lobby or changing room area'
            },
            {
              key: 'building-biosecurity-A2',
              value: 'An externally accessible storage room with a separate air space',
              hint: {
                text: `To create a separate air space, the area must have solid 
                ceiling height walls, providing a secure barrier from the 
                bird living area`
              }
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
          title: 'Will every level of the multi-tier system be connected to another level by a ramp?',
          pageTitle: '',
          url: 'ramp-connection',
          baseUrl: 'ramp-connection',
          backUrlObject: {
            dependentQuestionYarKey: 'currentSystem',
            dependentAnswerKeysArray: ['current-system-A1'],
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
                para: 'RPA want to fund multi-tier systems that have ramps to reduce the risk of keel bone fractures and benefit birds that have keel bone fractures.'
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
              error: 'Select yes if every level of the multi-tier system will be connected to another level by a ramp'
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
            text: 'The height of the highest tier in the multi-tier system from the litter floor area to the underside of the manure belt'
          },
          url: 'maximum-tier-height',
          baseUrl: 'maximum-tier-height',
          backUrl: 'ramp-connection',
          nextUrl: 'three-tiers',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `RPA want to fund projects that prevent birds falling from heights of more than 2 metres, to reduce the risk of keel bonefractures.`
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
          nextUrl: 'easy-grip-perches',
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
                para: 'RPA want to fund projects that improve biosecurity and use pollution mitigation practices\''
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
              value: 'A tree shelter belt near air outlets'
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
          title: 'Will the pullet housing have a veranda with these features?',
          pageTitle: '',
          hint: {
            html: `
                  <p>The veranda must:</p>
                  <ul class="govuk-list--bullet">
                      <li>be 4 metres wide or more along the length of the bird housing area, or 30% or more of the size of the indoor bird housing area footprint</li>
                      <li>have a solid concrete floor and waterproof insulated roof</li>
                      <li>have a perimeter wall of more than one metre in height</li>
                      <li>have a dimmable LED lighting system with a range between 0 lux and 60 lux</li>
                      <li>have a mesh roller-screen system running underneath the length of the roof, that fits securely against the wall when extended to make the housing biosecure during housing orders</li>
                      <li>have closable pop holes in the wall of the main house (unless the veranda forms part of an indoor barn system) that are less than 30cm from the floor level, or access ramps across the entire pop hole</li>
                      <li>not have perches in front of the pop holes</li>
                  </ul>`
          },
          url: 'pullet-veranda-features',
          baseUrl: 'pullet-veranda-features',
          nextUrl: 'dark-brooders',
          backUrl: 'pollution-mitigation',
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
              error: 'Select yes if the pullet housing will have a veranda with these features'
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
              value: 'No',
              notEligible: true
            },
          ],
          yarKey: 'darkBrooders'
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
          backUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A3'],
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
            dependentAnswerKeysArray: ['project-type-A3'],
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
            Defra may wish to contact you to understand your experience of applying for the scheme. Please confirm if you are happy for us to contact you to take part in optional research activities to help us improve our programmes and delivery.`
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
              text: 'I understand that the RPA will award the grant funding for adding a veranda only to existing housing on a first-come first-served basis.'
            },
            extraMessageContent: `<h2 class="govuk-heading-m">Improving our schemes</h2>
            Defra may wish to contact you to understand your experience of applying for the scheme. Please confirm if you are happy for us to contact you to take part in optional research activities to help us improve our programmes and delivery.`
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

const YAR_KEYS = ['itemsTotalValue', 'remainingCost', 'calculatedGrant', 'remainingCostCalf', 'calculatedGrantCalf', 'calfHousingCost']
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
