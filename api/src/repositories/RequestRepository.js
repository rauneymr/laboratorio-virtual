const Request = require('../models/Request')

class RequestRepository {
  async createRequest(requestData) {
    return Request.create(requestData)
  }

  async findRequestById(id) {
    return Request.findById(id)
  }

  async getAllRequests(filters) {
    return Request.findAll(filters)
  }

  async getPendingRequests(type = null) {
    return Request.getPendingRequests(type)
  }

  async updateRequestStatus(id, status, adminId) {
    return Request.update(id, { 
      status, 
      adminId,
      updatedAt: new Date() 
    })
  }

  async deleteRequest(id) {
    return Request.delete(id)
  }
}

module.exports = new RequestRepository()
