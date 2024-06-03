class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const statusCode = err.statusCode || err.response.status
  const codeNumber = isNaN(statusCode) ? 500 : statusCode
  const message =  err.message ? err.message : err.response.statusText
  const errorObj = {
    success: false,
    status: 'error',
    errorCode: codeNumber || statusCode || err.code,
    message,
    errorMessage: err.response.statusText ? err.response.statusText : err.message
  }
  res.status(codeNumber).json(errorObj)
}

module.exports = { ErrorHandler, handleError }
