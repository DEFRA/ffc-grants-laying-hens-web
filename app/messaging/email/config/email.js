const Joi = require('joi')

require('dotenv').config()

// Define config schema
const schema = Joi.object({
  notifyTemplate: Joi.string().required(),
  notifyTemplateVeranda: Joi.string().required()
})

// Build config
const config = {
  notifyTemplate: process.env.NOTIFY_EMAIL_TEMPLATE
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Build veranda config
const configVeranda = {
  notifyTemplateVeranda: process.env.NOTIFY_EMAIL_VERANDA_TEMPLATE
}

// Validate Veranda config
const resultVeranda = schema.validate(configVeranda, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error || resultVeranda.error) {
  throw new Error(`The email config is invalid. ${result.error.message || resultVeranda.error.message}`)
}

module.exports = result.value
