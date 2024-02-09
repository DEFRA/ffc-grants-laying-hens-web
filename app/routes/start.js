const urlPrefix = require('../config/server').urlPrefix
const currentPath = `${urlPrefix}/start`
const nextPath = `${urlPrefix}/project-type`

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: (_request, h) => h.view('home', { button: { nextLink: nextPath, text: 'Start now' } })
}
