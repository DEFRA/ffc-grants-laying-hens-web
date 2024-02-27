
const crumbToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
function crumbCookieRegEx () {
  return /crumb=([^\x00-\x20\"\,\;\\\x7F]*)/
}
function getCookieHeader (response) {
  return response.headers['set-cookie']
}
function getCrumbCookie (response) {
  const header = getCookieHeader(response)
  return header[0].match(crumbCookieRegEx())
}
async function setSessionVariables (server, keyValuPairs) {
  const options = {
    method: 'POST',
    url: '/set-my-session-variable',
    payload: { keys: keyValuPairs, crumb: crumbToken },
    headers: {
      cookie: 'crumb=' + crumbToken
    }
  }

  const response = await server.inject(options)
  console.log(response.statusCode)
}

const testNextLink = async (pageUrl, key, option, destination) => { 
  const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/${pageUrl}`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { [key]: option, crumb: crumbToken },
    }

  const postResponse = await global.__SERVER__.inject(postOptions)
  expect(postResponse.statusCode).toBe(302)
  expect(postResponse.headers.location).toBe(destination)
 }

module.exports = {
  crumbCookieRegEx,
  getCookieHeader,
  getCrumbCookie,
  setSessionVariables,
  crumbToken,
  testNextLink
}
