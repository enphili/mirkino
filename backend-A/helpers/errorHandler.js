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
  const message =  err.message ? err.message : err
  const errorObj = {
    codeNumber,
    success: false,
    status: 'error',
    errorCode: statusCode,
    message,
    errorMessage: err.errorMessage
  }
  res.status(codeNumber).json(errorObj)
}


module.exports = { ErrorHandler, handleError }
