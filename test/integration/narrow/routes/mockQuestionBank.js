const { regex } = require('ffc-grants-common-functionality')

const urlPrefix = global.__URLPREFIX__

const LIST_COUNTIES = []

const {
  MIN_GRANT,
  MAX_GRANT,
  GRANT_PERCENTAGE
} = { 'MIN_GRANT': 3500, 'MAX_GRANT': 350000, 'GRANT_PERCENTAGE': 40 }
require('dotenv').config()



const questionBank = {
  grantScheme: {
    key: 'FFC002',
    name: 'Productivity'
  },
  sections: [
    {
      name: 'eligibility',
      title: 'Eligibility',
      questions: [
        {
          key: 'applicant',
          order: 12,
          title: 'Who are you?',
          pageTitle: '',
          backUrl: 'project-subject',
          dependantNextUrl: {
            dependentQuestionYarKey: 'applicant',
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: 'legal-status',
              elseUrl: 'business-location'
            }
          },
          url: 'applicant',
          baseUrl: 'applicant',
          preValidationKeys: ['projectSubject'],
          ineligibleContent: {
            messageContent: 'Contractors cannot apply for grant funding for solar project items.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
    
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you’re a farmer or a contractor'
            }
          ],
          answers: [
            {
              key: 'applicant-A1',
              value: 'Farmer'
            },
            {
              key: 'applicant-A2',
              value: 'Contractor'
            }
          ],
          yarKey: 'applicant'
        },
        {
          key: 'business-location',
          order: 15,
          title: 'Is your business in England?',
          pageTitle: '',
          backUrl: 'applicant',
          nextUrl: 'legal-status',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          url: 'business-location',
          baseUrl: 'business-location',
          preValidationObject: {
            preValidationKeys: ['applicant'],
            preValidationAnswer: ['applicant-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['applicant']
          },
          ineligibleContent: {
            messageContent: 'This grant is only for businesses registered in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is only for businesses registered in England. \n \n Scotland, Wales and Northern Ireland have other grants available.',
                items: []
              }],
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the business is in England'
            }
          ],
          answers: [
            {
              key: 'business-location-A1',
              value: 'Yes'
            },
            {
              key: 'business-location-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'businessLocation'
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is the legal status of the business?',
          pageTitle: '',
          backUrlObject: {
            dependentQuestionYarKey: ['applicant'],
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: ['applicant'],
              elseUrl: 'business-location'
            }
          },
          nextUrl: 'country',
          url: 'legal-status',
          baseUrl: 'legal-status',
          preValidationObject: {
            preValidationKeys: ['businessLocation', 'applicant'], 
            preValidationAnswer: ['business-location-A1', 'applicant-A1'],
            preValidationRule: 'OR',
            preValidationUrls: ['business-location', 'applicant']
          },          
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
              }],
              

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
          errorMessage: {
            text: '' // why?
          },
          yarKey: 'legalStatus'
        },
        {
          key: 'country',
          order: 30,
          title: 'Is the planned project in England?',
          hint: {
            text: 'The site where the work will happen'
          },
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'planning-permission',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          url: 'country',
          baseUrl: 'country',
          preValidationObject: {
            preValidationKeys: ['legalStatus'],
            preValidationAnswer: ['legal-status-A12'],
            preValidationRule: 'NOT',
            preValidationUrls: ['legal-status']
          },
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is only for projects in England. \n \n Scotland, Wales and Northern Ireland have other grants available.',
                items: []
              }],
              

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
          key: 'existing-solar',
          order: 62,
          title: 'Does your farm have an existing solar PV system?',
          pageTitle: '',
          url: 'existing-solar',
          baseUrl: 'existing-solar',
          nextUrl: 'solar-technologies',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A1'],
            urlOptions: {
              thenUrl: 'tenancy',
              elseUrl: 'project-responsibility'
            }
          },
          preValidationObject: {
            preValidationKeys: ['tenancy', 'projectResponsibility'],
            preValidationAnswer: ['tenancy-A1', 'project-responsibility-A1', 'project-responsibility-A2'],
            preValidationRule: 'OR',
            preValidationUrls: ['tenancy', 'project-responsibility'],
            andCheck: 'project-subject-A2'
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: ' govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: `Applicants who already have a solar PV system can still apply for this grant. For example, you can apply for a battery to add to your existing solar PV panels.`,
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your farm has an existing solar PV system'
            }
          ],
          answers: [
            {
              key: 'existing-solar-A1',
              value: 'Yes'
            },
            {
              key: 'existing-solar-A2',
              value: 'No'
            }
          ],
          yarKey: 'existingSolar'
        },
        {
          key: 'solar-technologies',
          order: 61,
          title: 'What solar project items does your project need?',
          pageTitle: '',
          scheme: 'solar',
          score: {
            isScore: true,
            isDisplay: true
          },
          url: 'solar-technologies',
          baseUrl: 'solar-technologies',
          backUrl: 'existing-solar',
          nextUrl: 'project-cost-solar',
          preValidationObject: {
            preValidationKeys: ['existingSolar'],
            preValidationAnswer: ['existing-solar-A1', 'existing-solar-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['existing-solar']
          },
          id: 'solarTechnologies',
          name: 'solarTechnologies',
          hint: {
            html: `
                    You can apply for grant funding to:
                    <ul>
                      <li>buy a new solar PV system</li>
                      <li>add technology to an existing solar PV system on your farm</li>
                    </ul>
                    Select all that apply
                    `
          },
          ineligibleContent: {
            messageContent: 'If you do not have an existing solar PV system, you must apply for funding for solar PV panels to be eligible for this grant.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Include batteries</li></ul>',          
          type: 'multi-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'If you do not have an existing solar PV system, you must apply for funding for solar PV panels to be eligible for this grant.'
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what solar project items your project needs'
            }
          ],
          answers: [
            {
              key: 'solar-technologies-A1',
              value: 'An electrical grid connection'
            },
            {
              key: 'solar-technologies-A2',
              value: 'Solar PV panels'
            },
            {
              key: 'solar-technologies-A3',
              value: 'An inverter'
            },
            {
              key: 'solar-technologies-A4',
              value: 'A utility meter'
            },
            {
              key: 'solar-technologies-A5',
              value: 'A battery'
            },
            {
              key: 'solar-technologies-A6',
              value: 'Power diverter',
              hint: {
                text: 'Redirects excess solar energy to power storage (for example heat stores)'
              }
            }
          ],
          yarKey: 'solarTechnologies'
        }, //
        {
          key: 'solar-installation',
          order: 61,
          title: 'Where will you install the solar PV panels?',
          pageTitle: '',
          url: 'solar-installation',
          baseUrl: 'solar-installation',
          backUrl: 'solar-technologies',
          nextUrl: 'solar-output',
          preValidationObject: {
            preValidationKeys: ['solarTechnologies'],
            preValidationAnswer: ['solar-technologies-A2'],
            preValidationRule: 'NOTINCLUDES',
            preValidationUrls: ['solar-technologies']
          },
          id: 'solarInstallation',
          name: 'solarInstallation',
          hint: {
            text: 'Select all that apply'
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          ineligibleContent: {
            messageContent: `
                    <div class="govuk-list govuk-list--bullet">
                    <p class="govuk-body">Solar PV panels must be installed:</p>
                          <ul>
                            <li>on a rooftop</li>
                            <li>floating on an irrigation reservoir</li>
                          </ul>
                    </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Solar PV panels must be installed:',
                items: ['on a rooftop', 'floating on an irrigation reservoir']
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select where you will install the solar PV panels'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'solar-installation',
                answerKey: 'solar-installation-A4'
              }
            }
          ],
          answers: [
            {
              key: 'solar-installation-A1',
              value: 'On a rooftop'
            },
            {
              key: 'solar-installation-A2',
              value: 'Floating on an irrigation reservoir '
            },
            {
              value: 'divider'
            },
            {
              key: 'solar-installation-A3',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'solarInstallation'
        }, //
        {
          key: 'project-cost-solar',
          order: 65,
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'project-cost-solar',
          baseUrl: 'project-cost-solar',
          backUrlObject: {
            dependentQuestionYarKey: 'solarTechnologies',
            dependentAnswerKeysArray: ['solar-technologies-A2'],
            urlOptions: {
              thenUrl: 'solar-output',
              elseUrl: 'solar-technologies'
            }
          },
          nextUrl: 'potential-amount-solar',
          fundingPriorities: '',
          preValidationObject: {
            preValidationKeys: ['solarTechnologies', 'solarOutput'],
            preValidationAnswer: ['solar-technologies-A2'],
            preValidationRule: 'SPECIFICANDANY',
            preValidationUrls: ['solar-technologies', 'solar-output']
          },
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
            text: 'What is the total estimated cost of the solar project items?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'projectCost'
          },
          hint: {
            html: `
                  <p>You can only apply for a grant of up to 25% of the estimated costs.</p>
                  <p>The minimum grant you can apply for this project is £15,000 (25% of £60,000).</p>
                  <p>The maximum grant is £100,000 (25% of £400,000).</p>
                  <p>Do not include VAT</p>
                  <p>Enter amount, for example 95,000</p>
              `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the total estimated cost for the items'
            },
            {
              type: 'REGEX',
              regex: regex.PROJECT_COST_REGEX,
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
            messageContent: 'You can only apply for a grant of up to 25% of the estimated costs.',
            insertText: { text: 'The minimum grant you can apply for is £15,000 (25% of £60,000). The maximum grant is £100,000 (25% of £400,000).' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'automatic-eligibility',
          order: 375,
          title: `Which eligibility criteria does your automatic {{_technologyItems_}} meet?`,
          pageTitle: '',
          replace: true,
          url: 'automatic-eligibility',
          baseUrl: 'automatic-eligibility',
          backUrl: 'robotic-automatic',
          id: 'automaticEligibility',
          name: 'automaticEligibility',
          preValidationObject: {
            preValidationKeys: ['roboticAutomatic'],
            preValidationAnswer: ['robotic-automatic-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['robotic-automatic']
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            title: 'You cannot apply for a grant funding for this technology',
            messageContent: 'Automatic technology must fit at least 2 criteria to be eligible for grant funding.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'multi-answer',
          minAnswerCount: 1,
          hint: {
            text: 'Select all that apply'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Automatic technology must fit at least 2 criteria to be eligible for grant funding.',
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what eligibility criteria your automatic technology meets'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'automatic-eligibility',
                answerKey: 'automatic-eligibility-A5'
              }
            }
          ],
          answers: [
            {
              key: 'automatic-eligibility-A1',
              value: 'Has sensing system that can understand its environment'
            },
            {
              key: 'automatic-eligibility-A2',
              value: 'Makes decisions and plans'
            },
            {
              key: 'automatic-eligibility-A3',
              value: 'Can control its actuators (the devices that move robotic joints)'
            },
            {
              key: 'automatic-eligibility-A4',
              value: 'Works in a continuous loop'
            },
            {
              value: 'divider'
            },
            {
              key: 'automatic-eligibility-A5',
              value: 'None of the above'
            }
          ],
          yarKey: 'automaticEligibility'
        },
        {
          key: 'robotic-eligibility',
          order: 376,
          title: `Does your robotic {{_technologyItems_}} fit the eligibility criteria?`,
          pageTitle: '',
          replace: true,
          url: 'robotic-eligibility',
          baseUrl: 'robotic-eligibility',
          backUrl: 'robotic-automatic',
          nextUrl: 'technology-description',
          preValidationObject: {
            preValidationKeys: ['roboticAutomatic', 'technologyItems'],
            preValidationAnswer: ['robotic-automatic-A1', 'technology-items-A4', 'technology-items-A5', 'technology-items-A6', 'technology-items-A7', 'technology-items-A8'],
            preValidationRule: 'OR',
            preValidationUrls: ['robotic-automatic','technology-items']
          },
          eliminationAnswerKeys: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          id: 'roboticEligibility',
          hint: {
            html: 
            ` <div id="roboticEligibility">
                To be eligible, your robotic technology must:
                  <ul>
                    <li>have a sensing system and can understand its environment</li>
                    <li>make decisions and plan</li>
                    <li>be able to control its actuators (the devices that move robot joints)</li>
                    <li>work in a continuous loop</li>
                  <ul>
              </div>
            `
          },
          ineligibleContent: {
            title: 'You cannot apply for grant funding for this technology',
            messageContent: `RPA will only fund robotic technology that:
                            <ul class="govuk-list govuk-list--bullet">
                              <li>have a sensing system and can understand their environment</li>
                              <li>make decisions and plan</li>
                              <li>can control its actuators (the devices that move robot joints)</li>
                              <li>work in a continuous loop</li>
                            </ul>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Robotic technology must fit all 4 criteria to be eligible.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your robotic technology fits the eligibility criteria'
            },
          ],
          answers: [
            {
              key: 'robotic-eligibility-A1',
              value: 'Yes'
            },
            {
              key: 'robotic-eligibility-A2',
              value: 'No',
            }
          ],
          yarKey: 'roboticEligibility'
        },
        {
          key: 'technology-description',
          order: 305,
          title: 'Describe the {{_technologyItems_}}',
          pageTitle: '',
          nextUrl: 'project-items-summary',
          url: 'technology-description',
          baseUrl: 'technology-description',
          backUrlObject: {
            dependentQuestionYarKey: ['roboticAutomatic'],
            dependentAnswerKeysArray: ['robotic-automatic-A2'],
            urlOptions: {
              thenUrl: 'automatic-eligibility',
              elseUrl: 'robotic-eligibility'
            }
          },
          preValidationObject: {
            preValidationKeys: ['automaticEligibility', 'roboticEligibility', ],
            preValidationAnswer: ['automatic-eligibility-A5', 'robotic-eligibility-A2', ],
            preValidationRule: 'NOTOR',
            preValidationUrls: ['automatic-eligibility', 'robotic-eligibility', ]
          },
          fundingPriorities: '',
          minAnswerCount: 1,
          hint: {
            html: `Technology powered by fossil fuels will only be funded where there is no commercially available electric or renewable energy alternative<br/><br/>`
          },
          type: 'multi-input',
          allFields: [
            {
              yarKey: 'itemName',
              id: "itemName",
              name: "itemName",
              type: 'text',
              maxlength: 250,
              classes: 'govuk-input--width-10',
              label: {
                text: 'Item name',
                classes: 'govuk-label',
                for: 'itemName'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the name of the item'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 4,
                  max: 18,
                  error: 'Name of item must be between 4 and 18 characters'
                }
              ]
            },
            {
              yarKey: 'brand',
              id: "brand",
              name: "brand",
              type: 'text',
              maxlength: 250,
              classes: 'govuk-input--width-10',
              label: {
                text: 'Brand (optional)',
                classes: 'govuk-label',
                for: 'brand'
              },
              validate: [
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 18,
                  error: 'Brand must be 18 characters or less'
                }
              ]
            },
            {
              yarKey: 'model',
              id: "model",
              name: "model",
              type: 'text',
              maxlength: 250,
              classes: 'govuk-input--width-10',
              label: {
                text: 'Model (optional)',
                classes: 'govuk-label',
                for: 'model'
              },
              validate: [
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 18,
                  error: 'Model must be 18 characters or less'
                }
              ]
            },
            {
              yarKey: 'numberOfItems',
              id: "numberOfItems",
              name: "numberOfItems",
              type: 'text',
              inputmode: 'numeric',
              maxlength: 250,
              classes: 'govuk-input--width-2',
              label: {
                text: 'Number of these items (optional)',
                classes: 'govuk-label',
                for: 'numberOfItems'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: regex.WHOLE_NUMBER_REGEX_ZERO,
                  error: 'Number of items must be a number, like 18'
                }
              ]
            },
          ],
          yarKey: 'technologyDescription'
        },
        {
          key: 'farmer-details',
          order: 200,
          title: 'Farmer’s details',
          pageTitle: '',
          url: 'farmers-details',
          baseUrl: 'farmer-details',
          nextUrl: 'check-details',
          eliminationAnswerKeys: '',
          backUrlObject: {
            dependentQuestionYarKey: ['applying'],
            dependentAnswerKeysArray: ['applying-A2'],
            urlOptions: {
              thenUrl: 'agents-details',
              elseUrl: 'applying'
            }
          },
          preValidationObject: {
            preValidationKeys: ['applicant', 'businessDetails'],
            preValidationAnswer: ['applicant-A2'],
            preValidationRule: 'NOT',
            preValidationUrls: ['applicant', 'businessDetails'],
          },
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          ga: [{ dimension: 'cd3', value: { type: 'yar', key: 'applying' } }],
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
                  regex: regex.NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
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
                  regex: regex.NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
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
                text: "We'll only use this to send you confirmation"
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: regex.EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Mobile number',
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
                  regex: regex.CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: regex.PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              endFieldset: 'true',
              type: 'tel',
              classes: 'govuk-input--width-20',
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
                  regex: regex.CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: regex.PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business Address'
            },
            {
              yarKey: 'address1',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your address line 1'
                },
                {
                  type: 'REGEX',
                  regex: regex.ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                },
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 2 (optional)',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: regex.ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
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
                  error: 'Enter your business postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: regex.POSTCODE_REGEX,
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
                  error: 'Enter your project postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: regex.POSTCODE_REGEX,
                  error: 'Enter a project postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'farmerDetails'

        },
      ]
    }
  ]
}

const ALL_QUESTIONS = []
questionBank.sections.forEach(({ questions }) => {
  ALL_QUESTIONS.push(...questions)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach(question => ALL_URLS.push(question.url))

const YAR_KEYS = ['projectPostcode', 'remainingCost', 'projectItemsList', 'calculatedGrant', 'confirmItem'] 

ALL_QUESTIONS.forEach(question => question.yarKey && YAR_KEYS.push(question.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
