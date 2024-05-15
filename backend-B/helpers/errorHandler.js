class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const statusCode = err.statusCode
  const message =  err.message ? err.message : err
  res.status(isNaN(err.statusCode) ? 500 : err.statusCode).json({
    success: false,
    status: 'error',
    errorCode: statusCode || err.code,
    message
  })
}

module.exports = { ErrorHandler, handleError }
