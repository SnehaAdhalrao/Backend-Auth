class ApiResponse {
  constructor(statuscode, data, message = 'dat ka response done') {
    this.statuscode = statuscode
    this.data = data
    this.message = message
  }
}

export { ApiResponse } 
