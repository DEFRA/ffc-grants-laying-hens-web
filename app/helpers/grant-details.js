require('dotenv').config()
const MIN_GRANT = 15000
const MAX_GRANT = 500000
const VERANDA_MIN_GRANT = 5000
const VERANDA_MAX_GRANT = 100000
const GRANT_PERCENTAGE = process.env.GRANT_PERCENTAGE
const GRANT_PERCENTAGE_SOLAR = process.env.GRANT_PERCENTAGE_SOLAR

module.exports = {
  MIN_GRANT,
  MAX_GRANT,
  VERANDA_MIN_GRANT,
  VERANDA_MAX_GRANT,
  GRANT_PERCENTAGE,
  GRANT_PERCENTAGE_SOLAR
}
