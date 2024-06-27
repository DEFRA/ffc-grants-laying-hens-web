const emailConfig = require('./config/email')
const { GRANT_PERCENTAGE, GRANT_PERCENTAGE_SOLAR, VERANDA_FUNDING_CAP_REACHED } = require('../../helpers/grant-details')
const { ALL_QUESTIONS } = require('../../config/question-bank')
const spreadsheetConfig = require('./config/spreadsheet')
const { getQuestionAnswer } = require('ffc-grants-common-functionality').utils
const { microTurnover, smallTurnover, mediumTurnover, microEmployeesNum, smallEmployeesNum, mediumEmployeesNum } = require('./business-size-constants')
const { ALL } = require('dns')

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

function addAgentDetailsAddress(agentsDetails) {
  return [
    generateRow(29, 'Agent Address line 1', agentsDetails?.address1 ?? ''),
    generateRow(30, 'Agent Address line 2', agentsDetails?.address2 ?? ''),
    generateRow(32, 'Agent Address line 4 (town)', agentsDetails?.town ?? ''),
    generateRow(33, 'Agent Address line 5 (County)', agentsDetails?.county ?? ''),
    generateRow(34, 'Agent Postcode (use capitals)', agentsDetails?.postcode ?? '')
  ]
}

function addAgentDetails(agentsDetails) {
  return [
    generateRow(26, 'Agent Surname', agentsDetails?.lastName ?? ''),
    generateRow(27, 'Agent Forename', agentsDetails?.firstName ?? ''),
    ...addAgentDetailsAddress(agentsDetails),
    generateRow(35, 'Agent Landline number', agentsDetails?.landlineNumber ?? ''),
    generateRow(36, 'Agent Mobile number', agentsDetails?.mobileNumber ?? ''),
    generateRow(37, 'Agent Email', agentsDetails?.emailAddress ?? ''),
    generateRow(28, 'Agent Business Name', agentsDetails?.businessName ?? '')
  ]
}

function addFarmerTypeBlock(beef, horticulture, businessTypeArray) {
  return [
    // If chosen say yes, else be blank
    generateRow(431, beef, businessTypeArray.includes(beef) ? 'Yes' : ''),
    generateRow(432, 'Farmer with Dairy (including calf rearing)', businessTypeArray.includes('Farmer with Dairy (including calf rearing)') ? 'Yes' : ''),
    generateRow(433, 'Farmer with Pigs', businessTypeArray.includes('Farmer with Pigs') ? 'Yes' : ''),
    generateRow(434, 'Farmer with Sheep', businessTypeArray.includes('Farmer with Sheep') ? 'Yes' : ''),
    generateRow(435, 'Farmer with Laying Hens', businessTypeArray.includes('Farmer with Laying Hens') ? 'Yes' : ''),
    generateRow(436, 'Farmer with Meat Chickens', businessTypeArray.includes('Farmer with Meat Chickens') ? 'Yes' : ''),
    generateRow(437, 'Farmer with Aquaculture', businessTypeArray.includes('Farmer with Aquaculture') ? 'Yes' : ''), // replace with arable and shift up
    generateRow(439, horticulture, businessTypeArray.includes(horticulture) ? 'Yes' : ''),
  ]
}

function getAllNewFields(submission) {
  return [
    generateRow(520, 'Project type', submission.poultryType),
    generateRow(477, 'Bird Number', submission.birdNumber),
    generateRow(478, 'Veranda', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A1', ALL_QUESTIONS) ? submission.henVeranda : ''),
    generateRow(479, 'Veranda Features', submission.projectType === getQuestionAnswer('project-type', 'project-type-A1', ALL_QUESTIONS) ? submission.verandaOnlySize : ''),
    generateRow(480, 'Veranda Specification', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A1', ALL_QUESTIONS) ? submission.henVerandaFeatures : ''),
    generateRow(481, 'Building Items', submission.buildingItems),
    generateRow(482, 'Insulation', submission.replacingInsulation ?? submission.refurbishingInsulation),
    generateRow(483, 'Pullet Housing', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS) ? submission.pulletHousingRequirements : ''),
    generateRow(484, 'House Lighting System', submission.lightingFeatures),
    generateRow(485, 'Aviary System', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A1', ALL_QUESTIONS) ? submission.aviaryWelfare : ''),
    generateRow(486, 'Aviary System Features', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A1', ALL_QUESTIONS) ? submission.aviarySystem : ''),
    generateRow(487, 'Multi-tier System', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS) ? submission.multiTierSystem : ''),
    generateRow(488, 'Rearing System', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS) && submission.multiTierSystem === getQuestionAnswer('multi-tier-system', 'multi-tier-system-A1', ALL_QUESTIONS) ? submission.rearingAviarySystem : ''),
    generateRow(489, 'Step-up System', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS) && submission.multiTierSystem === getQuestionAnswer('multi-tier-system', 'multi-tier-system-A2', ALL_QUESTIONS) ? submission.rearingAviarySystem : ''),
    generateRow(490, 'Housing Density', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS) ? submission.housingDensity : ''),
    generateRow(491, 'Ventilation Features', submission.mechanicalVentilation),
    generateRow(492, 'Ventilation Specification', submission.henVentilationSpecification ?? submission.pulletVentilationSpecification),
    generateRow(493, 'Concrete Apron', submission.concreteApron),
    generateRow(494, 'Egg Store Access', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A1', ALL_QUESTIONS) ? submission.eggStoreAccess : ''),
    generateRow(495, 'Changing Area', submission.changingArea),
    generateRow(496, 'External Taps', submission.externalTaps),
    generateRow(497, 'Vehicle Washing Area', submission.vehicleWashing)
  ]
}
function getSolarAndFinanceFields(submission) {
  return [
    generateRow(419, 'Solar PV Panels', submission.roofSupportSolarPV),
    generateRow(442, 'Solar PV system', submission.solarPVSystem),

    generateRow(498, 'Roof support for Solar PV exemption', submission.solarPVSystem === getQuestionAnswer('solar-PV-system', 'solar-PV-system-A2', ALL_QUESTIONS) ? submission.roofSolarPVExemption : ''),
    generateRow(499, 'Number of Birds', submission.solarBirdNumber ?? ''),
    generateRow(500, 'Solar Power Capacity', submission.solarPowerCapacity ?? ''),

    generateRow(55, 'Total project expenditure', submission.solarPVCost ? String(Number(submission.totalProjectCost).toFixed(2)) : String(Number(submission.projectCost).toFixed(2))), // total cost, solar is totalProjectCost
    generateRow(57, 'Grant rate', submission.solarPVCost ? Number((submission.totalCalculatedGrant / submission.totalProjectCost) * 100).toFixed(2) : GRANT_PERCENTAGE), // if no soalr, 40. If solar, calculated grant / total cost * 100
    generateRow(56, 'Grant amount requested', submission.solarPVCost ? submission.totalCalculatedGrant : submission.calculatedGrant), // total grant, solar is totalCalculatedGrant
    generateRow(345, 'Remaining Cost to Farmer', submission.remainingCost),
    generateRow(445, 'Solar cost', submission.solarProjectCost ?? ''), // user entered solar cost
    generateRow(446, 'Solar grant amount', submission.solarCalculatedGrant ?? ''), // calculated solar cost

    // hen amounts, only used if solar too
    generateRow(501, 'Laying Hen Cost', submission.solarPVCost ? submission.projectCost : ''),
    generateRow(502, 'Laying Hen Grant Amount', submission.solarPVCost ? submission.calculatedGrant : '')
  ]
}

function getScoringFields(submission) {
  return [
    generateRow(503, 'Current System', submission.currentSystem),
    generateRow(504, 'Current multi-tier System', submission.currentSystem === getQuestionAnswer('current-system', 'current-system-A1', ALL_QUESTIONS) || submission.currentSystem === getQuestionAnswer('current-system', 'current-system-A2', ALL_QUESTIONS) ? '' : submission.currentMultiTierSystem),
    generateRow(505, 'Level Ramp Connection', submission.rampConnection),
    generateRow(506, 'Maximum Height of Highest Tier', submission.maximumTierHeight),
    generateRow(507, 'Tiers directly above each other', submission.tierNumber),
    generateRow(508, 'Consistent Housing', submission.henMultiTier ?? submission.pulletMultiTier),
    generateRow(509, 'Natural Light', submission.naturalLight),
    generateRow(510, 'Dark Brooders', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS) ? submission.darkBrooders : ''),
    generateRow(511, 'Perch Grip features', submission.easyGripPerches),
    generateRow(512, 'Building Biosecurity', [submission.buildingBiosecurity].flat().join(', ')),
    generateRow(513, 'Pollution Mitigation', [submission.pollutionMitigation].flat().join(', ')),
    generateRow(514, 'Veranda requirements', submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS) ? submission.pulletVerandaFeatures : ''),
    generateRow(515, 'Renewable Energy Sources', [submission.renewableEnergy].flat().join(', ')),
    generateRow(516, 'Poultry Management Data', [submission.birdDataType].flat().join(', ')),
    generateRow(517, 'Additional Environmental Data', [submission.environmentalDataType].flat().join(', ')),
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
  const returnArray = []
  for (const type in businessType) {
    // set up for capitalising where necessary
    if (businessType[type] === 'Laying hens (including pullets)') {
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
function getBusinessTypeC53(businessTypeArray, horticulture) {
  if (businessTypeArray.includes(horticulture) || businessTypeArray.includes('Farmer with Arable')) {
    return 'Mixed farming'
  } else {
    return 'Farmer with livestock'
  }
}

// confirm following values and mapping
const getPlanningPermissionDoraValue = planningPermission => {
  switch (planningPermission) {
    case 'Should be in place by the time I make my full application':
      return 'Applied for'
    case 'Not needed':
      return 'Not needed'
    default:
      return 'Approved'
  }
}

const generateDoraRows = (submission, subScheme, subTheme, businessTypeArray, projectDescriptionString, todayStr, desirabilityScore) => {
  const horticulture = 'Farmer with Horticulture'
  const beef = 'Farmer with Beef (including calf rearing)'

  return [
    generateRow(1, 'Field Name', 'Field Value', true),
    generateRow(2, 'FA or OA(EOI):', 'Outline Application'),
    generateRow(40, 'Scheme', 'Farming Transformation Fund'),
    generateRow(39, 'Sub scheme', subScheme),
    generateRow(43, 'Theme', subTheme),
    generateRow(90, 'Sub-Theme / Project type', ''),
    generateRow(41, 'Owner', 'RD'),
    generateRow(53, 'Business type', getBusinessTypeC53(businessTypeArray, horticulture)),
    generateRow(341, 'Grant Launch Date', '26/06/2024'),
    generateRow(23, 'Business Form Classification (Status of Applicant)', submission.legalStatus),

    generateRow(44, 'Description of Project', projectDescriptionString),

    ...addFarmerTypeBlock(beef, horticulture, businessTypeArray),

    generateRow(45, 'Location of project (postcode)', submission.farmerDetails.projectPostcode),
    generateRow(376, 'Project Started', submission.projectStart),
    generateRow(342, 'Land owned by Farm', submission.tenancy),
    generateRow(448, 'Project Responsibility', submission.projectResponsibility),

    ...getAllNewFields(submission),    
    ...getSolarAndFinanceFields(submission),
    ...getScoringFields(submission),

    generateRow(346, 'Planning Permission Status', getPlanningPermissionDoraValue(submission.planningPermission)),
    generateRow(366, 'Date of OA decision', ''), // confirm
    generateRow(42, 'Project name', submission.businessDetails.projectName),
    generateRow(4, 'Single business identifier (SBI)', submission.businessDetails.sbi || '000000000'),
    generateRow(518, 'CPH Number', submission.businessDetails.cph),
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
    generateRow(89,
      'Customer Marketing Indicator: So that we can continue to improve our services and schemes, we may wish to contact you in the future.',
      + ' Please indicate if you are happy for us, or a third party working for us, to contact you',
      submission.consentOptional ? 'Yes' : 'No'),
    generateRow(368, 'Date ready for QC or decision', todayStr),
    generateRow(369, 'Eligibility Reference No.', submission.confirmationId),
    generateRow(94, 'Current location of file', 'NA Automated'),
    generateRow(92, 'RAG rating', 'Green'),
    generateRow(93, 'RAG date reviewed ', todayStr),
    generateRow(54, 'Electronic OA received date ', todayStr),
    generateRow(519, 'Date and Time of OA Receipt', submission.dateTimeToday),
    generateRow(370, 'Status', 'Pending RPA review'),
    generateRow(85, 'Full Application Submission Date', '30/01/2026'),
    generateRow(375, 'OA percent', desirabilityScore ? String(desirabilityScore.desirability.overallRating.score) : ''),
    generateRow(365, 'OA score', desirabilityScore ? desirabilityScore.desirability.overallRating.band : ''),
    ...addAgentDetails(submission.agentsDetails)
  ]
}

function getSpreadsheetDetails(submission, desirabilityScore) {
  console.log('GET SPREADSHEET DETAILS')
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-GB')
  const subScheme = 'FTF-AHW-Laying Hens'
  const subTheme = submission.projectType === getQuestionAnswer('project-type', 'project-type-A1', ALL_QUESTIONS) ? 'Veranda Only' : 'Comprehensive'  

  const DD = String(today.getDate()).padStart(2, '0')
  const MM = String(today.getMonth() + 1).padStart(2, '0')
  const YYYY = today.getFullYear()
  const hh = String(today.getHours()).padStart(2, '0')
  const mm = String(today.getMinutes()).padStart(2, '0')

  submission.dateTimeToday = `${DD}/${MM}/${YYYY} ${hh}:${mm}`

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
  projectDescriptionString = submission.poultryType + ' ~ ' + submission.projectType

  if (submission.projectType != getQuestionAnswer('project-type', 'project-type-A1', ALL_QUESTIONS)) {
    if (submission.henVeranda === getQuestionAnswer('hen-veranda', 'hen-veranda-A3', ALL_QUESTIONS) || submission.pulletVerandaFeatures === getQuestionAnswer('pullet-veranda-features', 'pullet-veranda-features-A2', ALL_QUESTIONS)) {
      projectDescriptionString += ' ~ No veranda'
    } else {
      projectDescriptionString += ' ~ Veranda'
    }
  
    if (submission?.solarPVSystem === getQuestionAnswer('solar-PV-system', 'solar-PV-system-A1', ALL_QUESTIONS) && submission?.solarPVCost) {
      projectDescriptionString += ' ~ Solar'
    } else {
      projectDescriptionString += ' ~ Solar exempt'
    }
  }

  return {
    filename: generateExcelFilename(
      subScheme.trim(),
      submission.businessDetails.projectName.trim(),
      submission.businessDetails.businessName.trim(),
      submission.confirmationId.trim(),
      today
    ),
    uploadLocation: `Farming Investment Fund/Farming Transformation Fund/${spreadsheetConfig.uploadEnvironment}/Laying Hens/`,
    worksheets: [
      {
        title: 'DORA DATA',
        ...(spreadsheetConfig.protectEnabled ? { protectPassword: spreadsheetConfig.protectPassword } : {}),
        hideEmptyRows: spreadsheetConfig.hideEmptyRows,
        defaultColumnWidth: 30,
        rows: generateDoraRows(submission, subScheme, subTheme, businessTypeArray, projectDescriptionString, todayStr, desirabilityScore)
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
const getDetails = (submission) => {
  const henJourney = submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A1', ALL_QUESTIONS)
  const pulletJourney = submission.poultryType === getQuestionAnswer('poultry-type', 'poultry-type-A2', ALL_QUESTIONS)
  const isSolarPVSystemYes = submission.solarPVSystem === getQuestionAnswer('solar-PV-system', 'solar-PV-system-A1', ALL_QUESTIONS) && submission.projectCost < 1250000
  const isSolarPVSystemNo = submission.solarPVSystem === getQuestionAnswer('solar-PV-system', 'solar-PV-system-A2', ALL_QUESTIONS) 
  const rearingAviarySystemTrue = submission.rearingAviarySystem === getQuestionAnswer('rearing-aviary-system', 'rearing-aviary-system-A1', ALL_QUESTIONS)
  const stepUpSystemTrue = submission.stepUpSystem === getQuestionAnswer('step-up-system', 'step-up-system-A1', ALL_QUESTIONS)
  const verandaJourney = submission.projectType === getQuestionAnswer('project-type','project-type-A1', ALL_QUESTIONS)
  const isCurrentMultiTierSystemTrue = submission.currentSystem === getQuestionAnswer('current-system', 'current-system-A1', ALL_QUESTIONS) || submission.currentSystem === getQuestionAnswer('current-system', 'current-system-A2', ALL_QUESTIONS) 
  let currentMultiTierSystemText = ''

  if (!isCurrentMultiTierSystemTrue && henJourney) {
    currentMultiTierSystemText = 'Aviary system: '
  } else if (!isCurrentMultiTierSystemTrue && pulletJourney) {
    currentMultiTierSystemText = 'Multi-tier system: '
  }

  return {
    henJourney,
    pulletJourney,
    isSolarPVSystemYes,
    isSolarPVSystemNo,
    rearingAviarySystemTrue,
    stepUpSystemTrue,
    verandaJourney,
    isCurrentMultiTierSystemTrue,
    currentMultiTierSystemText
  }
}

const scoringQuestions = (submission, desirabilityScore) => {
  const { isCurrentMultiTierSystemTrue, currentMultiTierSystemText, pulletJourney, henJourney } = getDetails(submission)
    return {
      // Scoring Questions
      currentSystem: submission.currentSystem,
      currentSystemScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'current-system'),
      isCurrentMultiTierSystemTrue: !isCurrentMultiTierSystemTrue,
      currentMultiTierSystemText: currentMultiTierSystemText,
      currentMultiTierSystem: !isCurrentMultiTierSystemTrue ? submission.currentMultiTierSystem : '',
      currentMultiTierSystemScore: !isCurrentMultiTierSystemTrue ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'current-system') : '',
      rampConnection: submission.rampConnection,
      rampConnectionScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'ramp-connection'),
      maximumTierHeight: submission.maximumTierHeight,
      maximumTierHeightScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'maximum-tier-height'),
      tierNumber: submission.tierNumber,
      tierNumberScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'tier-number'),
      consistentHousing: henJourney ? submission.henMultiTier : submission.pulletMultiTier,
      consistentHousingScore: henJourney ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'hen-multi-tier') : getQuestionScoreBand(desirabilityScore.desirability.questions, 'pullet-multi-tier'),
      naturalLight: submission.naturalLight,
      naturalLightScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'natural-light'),
      darkBrooders: pulletJourney ? submission.darkBrooders : '',
      darkBroodersScore:  pulletJourney ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'dark-brooders') : '',
      easyGripPerches: submission.easyGripPerches,
      easyGripPerchesScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'easy-grip-perches'),
      buildingBiosecurity: [submission.buildingBiosecurity].flat().join(', '),
      buildingBiosecurityScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'building-biosecurity'),
      pollutionMitigation: [submission.pollutionMitigation].flat().join(', '),
      pollutionMitigationScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'pollution-mitigation'),
      pulletVerandaFeatures:  pulletJourney ? submission.pulletVerandaFeatures : '',
      pulletVerandaFeaturesScore: pulletJourney ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'pullet-veranda-features') : '',
      renewableEnergy: [submission.renewableEnergy].flat().join(', '),
      renewableEnergyScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'renewable-energy'),
      birdDataType: [submission.birdDataType].flat().join(', '),
      birdDataTypeScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'bird-data-type'),
      environmentalDataType: [submission.environmentalDataType].flat().join(', '),
      environmentalDataTypeScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'environmental-data-type'),
      scoreChance: getScoreChance(desirabilityScore.desirability.overallRating.band),
      overallRating: desirabilityScore.desirability.overallRating.band,
    }
}

const commonQuestionsForPulletAndHen = (submission) => {
  const { henJourney, pulletJourney, isSolarPVSystemYes, isSolarPVSystemNo } = getDetails(submission)
  return {
    ...commonQuestionsForAllJourney(submission),
    buildingItems: submission.buildingItems,
    replacingOrRefurbishingInsulation: submission.replacingInsulation || submission.refurbishingInsulation,
    lightingFeatures: submission.lightingFeatures,
    poultryTypeHen: henJourney,
    poultryTypePullet: pulletJourney,
    housingDensity: submission.housingDensity ?? '',
    mechanicalVentilation: submission.mechanicalVentilation,
    concreteApron: submission.concreteApron,
    changingArea: submission.changingArea,
    externalTaps: submission.externalTaps,
    solarPVSystem: submission.solarPVSystem,
    isSolarPVSystemYes: isSolarPVSystemYes,
    isSolarPVSystemNo: isSolarPVSystemNo,
    roofSupportSolarPV: submission.roofSupportSolarPV ?? '',
    roofSolarPVExemption: submission.roofSolarPVExemption ? [submission.roofSolarPVExemption].flat().join(', ') : '',
    solarGrantRate: isSolarPVSystemYes ? `Up to ${GRANT_PERCENTAGE_SOLAR}%` : '',
    solarBirdNumber: isSolarPVSystemYes ? submission.solarBirdNumber : '',
    solarPVCost: isSolarPVSystemYes ? getCurrencyFormat(Number(submission.solarPVCost.toString().replace(/,/g, ''))) : '',
    solarPowerCapacity: isSolarPVSystemYes ? submission.solarPowerCapacity : '',
    vehicleWashing: submission.vehicleWashing
  }
}

const commonQuestionsForAllJourney = (submission) => {
  const { henJourney } = getDetails(submission)
  return {
    poultryType: henJourney ? 'Laying hens (over 17 weeks old)' : 'Pullets (up to and including 17 weeks old)',
    birdNumber: submission.birdNumber,
    projectCost: getCurrencyFormat(submission.projectCost),
    potentialFunding: getCurrencyFormat(submission.calculatedGrant),
    remainingCost: submission.remainingCosts,
    grantRate: `Up to ${GRANT_PERCENTAGE}%`,
  }
}

const henQuestions = (submission) => {
    return {
      henVeranda: submission.henVeranda ?? '',
      henVerandaFeatures: submission.henVerandaFeatures ?? '',
      henVentilationSpecification: submission.henVentilationSpecification ?? '',
      aviaryWelfare: submission.aviaryWelfare ?? '',
      eggStoreAccess: submission.eggStoreAccess ?? '',
      aviarySystem: submission.aviarySystem ?? '',
    }
}

const pulletQuestions = (submission) => {
  const { rearingAviarySystemTrue, stepUpSystemTrue } = getDetails(submission)
    return {
      pulletHousingRequirements: submission.pulletHousingRequirements ?? '',
      pulletVeranda: submission.pulletVeranda ?? '',
      pulletVentilationSpecification: submission.pulletVentilationSpecification ?? '',
      multiTierSystem: submission.multiTierSystem ?? '',
      rearingAviarySystem: rearingAviarySystemTrue ? submission.rearingAviarySystem : '',
      rearingAviarySystemTrue: rearingAviarySystemTrue,
      stepUpSystem: stepUpSystemTrue ? submission.stepUpSystem : '',
      stepUpSystemTrue: stepUpSystemTrue
    }
}

const verandaQuestions = (submission) => {
  return {
    verandaOnlySize: submission.verandaOnlySize,
    verandaFeatures: submission.verandaFeatures
  }
}

const commonBusinessQuestions = (submission, isAgentEmail) => { 
  return {
    firstName: isAgentEmail ? submission.agentsDetails.firstName : submission.farmerDetails.firstName,
    lastName: isAgentEmail ? submission.agentsDetails.lastName : submission.farmerDetails.lastName,
    referenceNumber: submission.confirmationId,
    projectName: submission.businessDetails.projectName,
    businessName: submission.businessDetails.businessName,
    cphNumber: submission.businessDetails.cph,
    projectPostcode: submission.farmerDetails.projectPostcode,
    farmerName: submission.farmerDetails.firstName,
    farmerSurname: submission.farmerDetails.lastName,
    farmerEmail: submission.farmerDetails.emailAddress,
    agentName: submission.agentsDetails?.firstName ?? 'N/A',
    agentSurname: submission.agentsDetails?.lastName ?? ' ',
    agentBusinessName: submission.agentsDetails?.businessName ?? 'N/A',
    agentEmail: submission.agentsDetails?.emailAddress ?? 'N/A',
    contactConsent: submission.consentOptional ? 'Yes' : 'No',
    scoreDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

const commonEligibilityQuestions = (submission) => {
  return {
    projectType: submission.projectType,
    farmertype: [submission.applicantType].flat().join(', '),
    legalStatus: submission.legalStatus,
    businessLocation: submission.inEngland,
    planningPermission: submission.planningPermission,
    projectStart: submission.projectStart,
    tenancy: submission.tenancy,
    isNotTenancy: submission.tenancy === getQuestionAnswer('tenancy', 'tenancy-A2', ALL_QUESTIONS),
    projectResponsibility: submission.projectResponsibility ?? '',
  }
}


function getEmailDetails(submission, desirabilityScore, rpaEmail, isAgentEmail = false) {
  const { verandaJourney } = getDetails(submission)
  const email = isAgentEmail ? submission.agentsDetails.emailAddress : submission.farmerDetails.emailAddress

  if(verandaJourney) {
    return {
      notifyTemplate: emailConfig.notifyTemplateVeranda,
      emailAddress: rpaEmail || email,
      details: {
        //  All common questions
        ...commonQuestionsForAllJourney(submission),
         // Common Eligibility Questions
        ...commonEligibilityQuestions(submission),
         // veranda Questions
        ...verandaQuestions(submission),
          // Farmer and Agent details
        ...commonBusinessQuestions(submission, isAgentEmail),
        verandaFundingCapReached: VERANDA_FUNDING_CAP_REACHED
      }
    }
  }else{
    return {
      notifyTemplate: emailConfig.notifyTemplate,
      emailAddress: rpaEmail || email,
      details: {
        // Common Eligibility Questions
        ...commonEligibilityQuestions(submission),
        // Scoring Questions
        ...scoringQuestions(submission, desirabilityScore),
  
        // Hen and pullet questions email variable
        ...henQuestions(submission),
        ...pulletQuestions(submission),
        ...commonQuestionsForPulletAndHen(submission),

        // Farmer and Agent details
        ...commonBusinessQuestions(submission, isAgentEmail)
      }
    }
  }
}

function spreadsheet(submission, desirabilityScore) {
  return getSpreadsheetDetails(submission, desirabilityScore)
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
