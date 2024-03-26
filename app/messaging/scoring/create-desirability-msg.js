const grantSchemeConfig = require('./config/grant-scheme')
const { getQuestionAnswer } = require('ffc-grants-common-functionality').utils
const { ALL_QUESTIONS } = require('../../config/question-bank')

const { desirabilityInputQuestionMapping, desirabilityQuestions: questionContent } = require('./content-mapping')
const desirabilityQuestionsHen = ['current-system', 'current-multi-tier-system', 'ramp-connection', 'maximum-tier-height', 'three-tiers', 'hen-multi-tier', 'natural-light', 'easy-grip-perches', 'building-biosecurity', 'pollution-mitigation', 'renewable-energy', 'bird-data-type', 'environmental-data-type']
const desirbailityQuestionsPullet = ['current-system', 'current-multi-tier-system', 'ramp-connection', 'maximum-tier-height', 'three-tiers', 'pullet-multi-tier', 'natural-light', 'dark-brooders', 'easy-grip-perches', 'building-biosecurity', 'pollution-mitigation', 'pullet-veranda-features', 'renewable-energy', 'bird-data-type', 'environmental-data-type']

const POULTRY_TYPE_HENS = getQuestionAnswer('poultry-type', 'poultry-type-A1', ALL_QUESTIONS)

function getUserAnswer (answers, userInput) {
  if (answers) {
    return [userInput].flat().map(answer =>
      ({ key: Object.keys(answers).find(key => answers[key] === answer), value: answer }))
  }

  return {}
}

function getDesirabilityDetails(questionKey, userInput) {
  const content = questionContent[questionKey]
  return {
    key: questionKey,
    answers: content.map(({ key, title, answers }) => ({
      key,
      title,
      input: getUserAnswer(answers, userInput[desirabilityInputQuestionMapping[key]])
    })),
    rating: {
      score: null,
      band: null,
      importance: null
    }
  }
}

function desirability (userInput) {
  const isHens = userInput.poultryType === POULTRY_TYPE_HENS
  const key = isHens ? 'LAYINGHENS01' : 'LAYINGHENS02'
  const validKeys = isHens ? desirabilityQuestionsHen : desirbailityQuestionsPullet
  const grantScheme = grantSchemeConfig.filter(grant => grant.key === key)[0]

  return {
    grantScheme: {
      key: grantScheme.key,
      name: grantScheme.name
    },
    desirability: {
      questions: validKeys.map(questionKey => getDesirabilityDetails(questionKey, userInput)),
      overallRating: {
        score: null,
        band: null
      }
    }
  }
}

// had to export getUSerAnswer in order to test the if(answer) function, given that answer always came from
//   hardcoded list at top of file.
// function not used anywhere else other than this file and test file
module.exports = { desirability, getUserAnswer }
