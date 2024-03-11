require('dotenv').config()
const MIN_GRANT = 5000
const MAX_GRANT = 100000
const GRANT_PERCENTAGE = process.env.GRANT_PERCENTAGE

module.exports = {
  MIN_GRANT,
  MAX_GRANT,
  GRANT_PERCENTAGE,
}
