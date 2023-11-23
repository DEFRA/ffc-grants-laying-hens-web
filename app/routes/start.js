const urlPrefix = require('../config/server').urlPrefix
const currentPath = `${urlPrefix}/start`
const nextPath = `${urlPrefix}/applicant-type`

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: (_request, h) => {
    return h.view('home', { button: { nextLink: nextPath, text: 'Start now' } })
  }
}
