class ApiError extends Error {
  constructor(
    statuscode,
    message = 'Something is missing',
    error = [],
    stack = '',
  ) {
    super(message)
    this.statuscode = statuscode
    this.message = message
    this.error = error
    this.stack = stack
  }
}

export { ApiError } 