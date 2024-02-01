const urlPrefix = require('../config/server').urlPrefix

module.exports = {
  method: 'GET',
  path: `${urlPrefix}/accessibility`,
  handler: (_request, h) => h.view('accessibility', { accessibility: 'accessibility' })
}
