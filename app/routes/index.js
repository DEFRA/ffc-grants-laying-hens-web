const urlPrefix = require('../config/server').urlPrefix
const { questionBank } = require('../config/question-bank')
const { getHandler, getPostHandler } = require('../helpers/handlers')

const drawSectionGetRequests = section => {
  return section.questions.map(question => {
    return {
      method: 'GET',
      path: `${urlPrefix}/${question.url}`,
      handler: getHandler(question)
    }
  })
}

const drawSectionPostRequests = section => {
  return section.questions.map(question => {
    return {
      method: 'POST',
      path: `${urlPrefix}/${question.url}`,
      handler: getPostHandler(question)
    }
  })
}

let pages = questionBank.sections.map(section => drawSectionGetRequests(section))
pages = [...pages, ...questionBank.sections.map(section => drawSectionPostRequests(section))]
pages.push(require('./potential-amount-solar-calculation'), require('./interruption-scoring'))
module.exports = pages
