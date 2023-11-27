const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-grants-laying-hens-web',
    ...options
  }
}

module.exports = createMessage
