const emailConfig = require('./config/email')
const spreadsheetConfig = require('./config/spreadsheet')
const { microTurnover, smallTurnover, mediumTurnover, microEmployeesNum, smallEmployeesNum, mediumEmployeesNum } = require('./business-size-constants')

function getQuestionScoreBand(questions, questionKey) {
  return questions.filter(question => question.key === questionKey).length > 0
    ? questions.find(question => question.key === questionKey).rating.band
    : ''
}

function generateRow(rowNumber, name, value, bold = false) {
  return {
    row: rowNumber,
    values: ['', name, value],
    bold
  }
}

function calculateBusinessSize(employees) {
  const employeesNum = Number(employees)

  if (employeesNum < microEmployeesNum) {
    return 'Micro'
  } else if (employeesNum < smallEmployeesNum) {
    return 'Small'
  } else if (employeesNum < mediumEmployeesNum) {
    return 'Medium'
  } else {
    return 'Large'
  }
}

function addAgentDetails(agentsDetails) {
  return [
    generateRow(26, 'Agent Surname', agentsDetails?.lastName ?? ''),
    generateRow(27, 'Agent Forename', agentsDetails?.firstName ?? ''),
    generateRow(29, 'Agent Address line 1', agentsDetails?.address1 ?? ''),
    generateRow(30, 'Agent Address line 2', agentsDetails?.address2 ?? ''),
    generateRow(32, 'Agent Address line 4 (town)', agentsDetails?.town ?? ''),
    generateRow(33, 'Agent Address line 5 (County)', agentsDetails?.county ?? ''),
    generateRow(34, 'Agent Postcode (use capitals)', agentsDetails?.postcode ?? ''),
    generateRow(35, 'Agent Landline number', agentsDetails?.landlineNumber ?? ''),
    generateRow(36, 'Agent Mobile number', agentsDetails?.mobileNumber ?? ''),
    generateRow(37, 'Agent Email', agentsDetails?.emailAddress ?? ''),
    generateRow(28, 'Agent Business Name', agentsDetails?.businessName ?? '')
  ]
}

function generateExcelFilename(scheme, projectName, businessName, referenceNumber, today) {
  const dateTime = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short',
    dateStyle: 'short',
    timeZone: 'Europe/London'
  }).format(today).replace(/\//g, '-')
  return `${scheme}_${projectName}_${businessName}_${referenceNumber}_${dateTime}.xlsx`
}

// Formats array of businessType for C430-440
function formatBusinessTypeC53(businessType) {
  let returnArray = []
  for (type in businessType) {
    // set up for capitalising where necessary
    if (businessType[type] === 'Laying hens') {
      businessType[type] = 'Laying Hens'
    } else if (businessType[type] === 'Meat chickens') {
      businessType[type] = 'Meat Chickens'
    }

    // assign values for DORA
    returnArray.push('Farmer with ' + businessType[type])
  }
  return returnArray
}

// formats for business type dora field (single answer accepted)
function getBusinessTypeC53(businessTypeArray) {
  if (businessTypeArray.includes('Farmer with Horticulture') || businessTypeArray.includes('Farmer with Arable')) {
    return 'Mixed farming'
  } else if (businessTypeArray.length > 1) {
    return 'Farmer with livestock'
  } else if (businessTypeArray[0] === 'Farmer with Beef (including calf rearing)') {
    return 'Beef Farmer'
  } else {
    return 'Dairy farmer'
  }
}

// confirm following values and mapping
const getPlanningPermissionDoraValue = (planningPermission) => {
  switch (planningPermission) {
    case 'Should be in place by the time I make my full application':
      return 'Applied for'
    case 'Not needed':
      return 'Not needed'
    default:
      return 'Approved'
  }
}

function getSpreadsheetDetails(submission, desirabilityScore) {
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-GB')
  // const schemeName = 'Calf Housing for Health and Welfare'
  const subScheme = 'FTF-AHW-Calf Housing'
  const subTheme = 'Calf housing for health and welfare'

  // format array for applicantType field and individual fields
  let businessTypeArray
  const applicantTypeArray = submission.applicantType

  if (Array.isArray(applicantTypeArray)) {
    businessTypeArray = formatBusinessTypeC53(applicantTypeArray)
  } else {
    const tempArray = []
    tempArray.push(applicantTypeArray)
    console.log(Array.isArray(tempArray))
    businessTypeArray = formatBusinessTypeC53(tempArray)
  }

  let projectDescriptionString = ''
  projectDescriptionString = projectDescriptionString.concat(submission.project, '|', submission.structure, '|', submission.structureEligibility === 'Yes' ? submission.yesStructureEligibility : '')

  return {
    filename: generateExcelFilename(
      subScheme.trim(),
      submission.businessDetails.projectName.trim(),
      submission.businessDetails.businessName.trim(),
      submission.confirmationId.trim(),
      today
    ),
    uploadLocation: `Farming Investment Fund/Farming Transformation Fund/${spreadsheetConfig.uploadEnvironment}/Cattle Housing/`,
    worksheets: [
      {
        title: 'DORA DATA',
        ...(spreadsheetConfig.protectEnabled ? { protectPassword: spreadsheetConfig.protectPassword } : {}),
        hideEmptyRows: spreadsheetConfig.hideEmptyRows,
        defaultColumnWidth: 30,
        rows: [
          generateRow(1, 'Field Name', 'Field Value', true),
          generateRow(2, 'FA or OA(EOI):', 'Outline Application'),
          generateRow(40, 'Scheme', 'Farming Transformation Fund'),
          generateRow(39, 'Sub scheme', subScheme),
          generateRow(43, 'Theme', subTheme),
          generateRow(90, 'Sub-Theme / Project type', submission.project),
          generateRow(41, 'Owner', 'RD'),
          generateRow(53, 'Business type', getBusinessTypeC53(businessTypeArray)), // design action
          generateRow(341, 'Grant Launch Date', '07/09/2023'),
          generateRow(23, 'Business Form Classification (Status of Applicant)', submission.legalStatus),
          generateRow(405, 'Project Type', submission.project),
          // generateRow(406, 'Calf Weight', submission.calfWeight),
          generateRow(407, 'Minimum floor area', submission.minimumFloorArea),
          generateRow(408, 'Calves Housed Individually', submission.housedIndividually),
          generateRow(409, 'Isolate Sick Calves', submission.isolateCalves),
          generateRow(410, 'Straw Bedding', submission.strawBedding),
          generateRow(411, 'Flooring and Bedding', submission.concreteFlooring),
          generateRow(412, 'Enrichment', submission.enrichment),
          generateRow(413, 'Building Structure', submission.structure),
          generateRow(414, 'Other Building Structure', submission.yesStructureEligibility ?? submission.structureEligibility),
          generateRow(415, 'Drainage', submission.drainageSlope),
          generateRow(416, 'Draught Protection', submission.draughtProtection),
          generateRow(417, 'Additional Required Items', submission.additionalItems),
          // generateRow(418, 'Lighting', submission.lighting), // new lighting page doesnt exist yet
          generateRow(419, 'Solar PV Panels', submission.roofSolarPV),

          generateRow(420, 'Moving from Individually Housed', submission.housing),
          generateRow(421, 'Average Calf Size Group', submission.calfGroupSize),
          generateRow(423, 'Moisture Control', submission.moistureControl),
          generateRow(424, 'Permanent Sick Pen', submission.permanentSickPen),
          generateRow(426, 'Environmental Impact', submission.environmentalImpact),
          generateRow(427, 'Sustainable Materials', submission.sustainableMaterials),
          generateRow(428, 'Introducing Innovation', submission.introducingInnovation),

          generateRow(44, 'Description of Project', projectDescriptionString),

          // If chosen say yes, else be blank
          generateRow(431, 'Farmer with Beef (including calf rearing)', businessTypeArray.includes('Farmer with Beef (including calf rearing)') ? 'Yes' : ''),
          generateRow(432, 'Farmer with Dairy (including calf rearing)', businessTypeArray.includes('Farmer with Dairy (including calf rearing)') ? 'Yes' : ''),
          generateRow(433, 'Farmer with Pigs', businessTypeArray.includes('Farmer with Pigs') ? 'Yes' : ''),
          generateRow(434, 'Farmer with Sheep', businessTypeArray.includes('Farmer with Sheep') ? 'Yes' : ''),
          generateRow(435, 'Farmer with Laying Hens', businessTypeArray.includes('Farmer with Laying Hens') ? 'Yes' : ''),
          generateRow(436, 'Farmer with Meat Chickens', businessTypeArray.includes('Farmer with Meat Chickens') ? 'Yes' : ''),
          generateRow(437, 'Farmer with Aquaculture', businessTypeArray.includes('Farmer with Aquaculture') ? 'Yes' : ''), // replace with arable and shift up
          generateRow(439, 'Farmer with Horticulture', businessTypeArray.includes('Farmer with Horticulture') ? 'Yes' : ''),

          generateRow(440, 'Solar exempt - Upgrade to existing', submission.upgradingExistingBuilding ?? ''),
          generateRow(441, 'Solar exempt - World Heritage Site', submission.heritageSite ?? ''),
          generateRow(442, 'Buy Solar PV system', submission.solarPVSystem ?? ''),
          generateRow(443, 'Calf housing cost', submission?.projectCostSolar?.calfHousingCost ?? String(Number(submission.projectCost).toFixed(2))),
          generateRow(444, 'Calf housing grant amount', submission.calculatedGrantCalf ?? submission.calculatedGrant),
          generateRow(445, 'Solar cost', submission?.projectCostSolar?.SolarPVCost ?? ''),
          generateRow(446, 'Solar grant amount', submission.calculatedGrantSolar ?? ''),

          generateRow(45, 'Location of project (postcode)', submission.farmerDetails.projectPostcode),
          generateRow(376, 'Project Started', submission.projectStart),
          generateRow(342, 'Land owned by Farm', submission.tenancy),
          generateRow(343, 'Tenancy for next 5 years', submission.tenancyLength ?? ''),
          generateRow(55, 'Total project expenditure', String(Number(submission.projectCost).toFixed(2))),
          generateRow(57, 'Grant rate', '40'),
          generateRow(56, 'Grant amount requested', submission.calculatedGrant),
          generateRow(345, 'Remaining Cost to Farmer', submission.remainingCost),
          generateRow(346, 'Planning Permission Status', getPlanningPermissionDoraValue(submission.planningPermission)),
          generateRow(366, 'Date of OA decision', ''), // confirm
          generateRow(42, 'Project name', submission.businessDetails.projectName),
          generateRow(4, 'Single business identifier (SBI)', submission.businessDetails.sbi || '000000000'), // sbi is '' if not set so use || instead of ??
          generateRow(429, 'Calving System', submission.businessDetails.calvingSystem ?? ''),
          generateRow(430, 'Number of Calves', submission.businessDetails.calvesNumber ?? ''),
          generateRow(7, 'Business name', submission.businessDetails.businessName),
          generateRow(367, 'Annual Turnover', submission.businessDetails.businessTurnover),
          generateRow(22, 'Employees', submission.businessDetails.numberEmployees),
          generateRow(20, 'Business size', calculateBusinessSize(submission.businessDetails.numberEmployees)),
          generateRow(91, 'Are you an AGENT applying on behalf of your customer', submission.applying === 'Agent' ? 'Yes' : 'No'),
          generateRow(5, 'Surname', submission.farmerDetails.lastName),
          generateRow(6, 'Forename', submission.farmerDetails.firstName),
          generateRow(8, 'Address line 1', submission.farmerDetails.address1),
          generateRow(9, 'Address line 2', submission.farmerDetails.address2),
          generateRow(11, 'Address line 4 (town)', submission.farmerDetails.town),
          generateRow(12, 'Address line 5 (county)', submission.farmerDetails.county),
          generateRow(13, 'Postcode (use capitals)', submission.farmerDetails.postcode),
          generateRow(16, 'Landline number', submission.farmerDetails.landlineNumber ?? ''),
          generateRow(17, 'Mobile number', submission.farmerDetails.mobileNumber ?? ''),
          generateRow(18, 'Email', submission.farmerDetails.emailAddress),
          generateRow(89, 'Customer Marketing Indicator: So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please indicate if you are happy for us, or a third party working for us, to contact you', submission.consentOptional ? 'Yes' : 'No'),
          generateRow(368, 'Date ready for QC or decision', todayStr),
          generateRow(369, 'Eligibility Reference No.', submission.confirmationId),
          generateRow(94, 'Current location of file', 'NA Automated'),
          generateRow(92, 'RAG rating', 'Green'),
          generateRow(93, 'RAG date reviewed ', todayStr),
          generateRow(54, 'Electronic OA received date ', todayStr),
          generateRow(370, 'Status', 'Pending RPA review'),
          generateRow(85, 'Full Application Submission Date', '30/04/2025'),
          generateRow(375, 'OA percent', String(desirabilityScore.desirability.overallRating.score)),
          generateRow(365, 'OA score', desirabilityScore.desirability.overallRating.band),
          ...addAgentDetails(submission.agentsDetails)
        ]
      }
    ]
  }
}

function getCurrencyFormat(amount) {
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, style: 'currency', currency: 'GBP' })
}

function getScoreChance(rating) {
  switch (rating.toLowerCase()) {
    case 'strong':
      return 'seems likely to'
    case 'average':
      return 'might'
    default:
      return 'seems unlikely to'
  }
}

function getEmailDetails(submission, desirabilityScore, rpaEmail, isAgentEmail = false) {
  const email = isAgentEmail ? submission.agentsDetails.emailAddress : submission.farmerDetails.emailAddress
  return {
    notifyTemplate: emailConfig.notifyTemplate,
    emailAddress: rpaEmail || email,
    details: {
      firstName: isAgentEmail ? submission.agentsDetails.firstName : submission.farmerDetails.firstName,
      lastName: isAgentEmail ? submission.agentsDetails.lastName : submission.farmerDetails.lastName,
      referenceNumber: submission.confirmationId,
      overallRating: desirabilityScore.desirability.overallRating.band,
      scoreChance: getScoreChance(desirabilityScore.desirability.overallRating.band),
      legalStatus: submission.legalStatus,
      applicantType: submission.applicantType ? [submission.applicantType].flat().join(', ') : ' ',
      location: submission.inEngland,
      planningPermission: submission.planningPermission,
      projectPostcode: submission.farmerDetails.projectPostcode,
      projectStart: submission.projectStart,
      tenancy: submission.tenancy,
      tenancyAgreement: submission.tenancyLength ?? 'N/A',
      project: submission.project,
      minimumFloorArea: submission.minimumFloorArea,
      housedIndividually: submission.housedIndividually,
      isolateCalves: submission.isolateCalves,
      strawBedding: submission.strawBedding,
      concreteFlooring: submission.concreteFlooring,
      enrichment: submission.enrichment,
      structure: submission.structure,
      structureEligibility: submission.structureEligibility === 'Yes' ? submission.yesStructureEligibility : submission.structureEligibility ?? 'N/A',
      draughtProtection: submission.draughtProtection,
      drainageSlope: submission.drainageSlope,
      additionalItems: submission.additionalItems,
      roofSolarPV: submission.roofSolarPV,
      upgradingExistingBuilding: submission.upgradingExistingBuilding ? submission.upgradingExistingBuilding : '',
      upgradingExistingBuildingTrue: submission.upgradingExistingBuilding ? 'true' : 'false',
      heritageSite: submission.heritageSite ? submission.heritageSite : '',
      heritageSiteTrue: submission.heritageSite ? 'true' : 'false',
      solarPVSystem: submission.solarPVSystem ? submission.solarPVSystem : '',
      solarPVSystemTrue: submission.solarPVSystem ? 'true' : 'false',
      grantRateSolarTrue: submission.solarPVSystem === 'Yes' ? 'true' : 'false',
      SolarPVCost: submission.SolarPVCost ? getCurrencyFormat(submission.SolarPVCost) : '',
      SolarPVCostTrue: submission.SolarPVCost ? 'true' : 'false',
      calculatedGrantSolar: submission.calculatedGrantSolar ? getCurrencyFormat(submission.calculatedGrantSolar) : '',
      calculatedGrantSolarTrue: submission.calculatedGrantSolar ? 'true' : 'false',
      calfHousingCost: submission?.projectCostSolar?.calfHousingCost ?? getCurrencyFormat(submission.projectCost),
      calculatedGrantCalf: submission.calculatedGrantCalf ? getCurrencyFormat(submission.calculatedGrantCalf) : getCurrencyFormat(submission.calculatedGrant),
      projectCost: getCurrencyFormat(submission.projectCost),
      potentialFunding: getCurrencyFormat(submission.calculatedGrant),
      remainingCost: submission.remainingCosts,
      housing: submission.housing,
      housingScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'housing'),
      calfGroupSize: submission.calfGroupSize,
      calfGroupSizeScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'calf-group-size'),
      moistureControl: submission.moistureControl,
      moistureControlScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'moisture-control'),
      permanentSickPen: submission.permanentSickPen,
      permanentSickPenScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'permanent-sick-pen'),
      environmentalImpact: submission.SolarPVCost != null,
      rainwater: submission.SolarPVCost === null,

      // notification service cant handle more than one variable in an if statement, so this is how to do it
      environmentalImpactValue: submission.SolarPVCost === null ? (submission.environmentalImpact === 'None of the above' ? 'No' : 'Yes') : submission.environmentalImpact,

      environmentalImpactScore: submission.SolarPVCost != null ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'environmental-impact') : getQuestionScoreBand(desirabilityScore.desirability.questions, 'rainwater'),

      sustainableMaterials: submission.sustainableMaterials,
      sustainableMaterialsScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'sustainable-materials'),
      introducingInnovation: submission.introducingInnovation,
      introducingInnovationScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'introducing-innovation'),
      projectName: submission.businessDetails.projectName,
      projectType: submission.projectType,
      calvingSystem: submission.businessDetails.calvingSystem ? submission.businessDetails.calvingSystem : 'N/A',
      calvesNumber: submission.businessDetails.calvesNumber ? submission.businessDetails.calvesNumber : 'N/A',
      businessName: submission.businessDetails.businessName,
      farmerName: submission.farmerDetails.firstName,
      farmerSurname: submission.farmerDetails.lastName,
      farmerEmail: submission.farmerDetails.emailAddress,
      agentName: submission.agentsDetails?.firstName ?? 'N/A',
      agentSurname: submission.agentsDetails?.lastName ?? ' ',
      agentBusinessName: submission.agentsDetails?.businessName ?? 'N/A',
      agentEmail: submission.agentsDetails?.emailAddress ?? 'N/A',
      contactConsent: submission.consentOptional ? 'Yes' : 'No',
      scoreDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
      businessType: submission.applicantBusiness
    }
  }
}

function spreadsheet(submission, desirabilityScore) {
  const data = getSpreadsheetDetails(submission, desirabilityScore)
  return data
}

module.exports = function (submission, desirabilityScore, rating = '') {
  return {
    applicantEmail: getEmailDetails(submission, desirabilityScore, false),
    agentEmail: submission.applying === 'Agent' ? getEmailDetails(submission, desirabilityScore, false, true) : null,
    rpaEmail: spreadsheetConfig.sendEmailToRpa ? getEmailDetails(submission, desirabilityScore, spreadsheetConfig.rpaEmail) : null,
    spreadsheet: spreadsheet(submission, desirabilityScore),
    getScoreChance: getScoreChance(rating)
  }
}
