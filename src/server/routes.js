const postPredictHandler = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000, // Set maximum payload size to 1MB
        output: 'stream', // Ensure the payload is processed as a stream
        parse: true // Ensure the payload is parsed
      }
    }
  }
]

module.exports = routes;