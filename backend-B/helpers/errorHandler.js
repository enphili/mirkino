class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const statusCode = err.statusCode || err.response?.status || err.code || err.errorCode
  const codeNumber = isNaN(statusCode) ? 500 : statusCode
  const errorObj = {
    success: false,
    status: 'error',
    errorCode: codeNumber || err.code,
    message: err.message || err.response?.statusText,
    errorMessage: err.response?.statusText || err.code
  }
  res.status(codeNumber).json(errorObj)
}

module.exports = { ErrorHandler, handleError }
