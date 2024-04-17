const urlPrefix = require('../config/server').urlPrefix
const currentPath = `${urlPrefix}/interruption-scoring`
const nextPath = `${urlPrefix}/current-system`
const previousPath = `${urlPrefix}/remaining-costs`

module.exports = [{
    method: 'GET',
    path: currentPath,
    handler: (_request, h) => h.view('interruption-scoring', {backLink: previousPath, nextLink: nextPath})
    }, 
    {
    method: 'POST',
    path: currentPath,
    handler: (request, h) => {
        return h.redirect(nextPath)
    }
}]
