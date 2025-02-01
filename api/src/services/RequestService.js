const RequestRepository = require('../repositories/RequestRepository')
const UserRepository = require('../repositories/UserRepository')

class RequestService {
  async createScheduleRequest(userId, workbenchId, startDate, endDate, description) {
    return RequestRepository.createRequest({
      userId,
      workbenchId,
      type: 'workbench_schedule',
      status: 'PENDING',
      startDate,
      endDate,
      description
    })
  }

  async createRegistrationRequest(userId) {
    return RequestRepository.createRequest({
      userId,
      type: 'user_registration',
      status: 'PENDING'
    })
  }

  async getPendingRequests(type = null) {
    return RequestRepository.getPendingRequests(type)
  }

  async approveRequest(requestId, adminId) {
    const request = await RequestRepository.findRequestById(requestId)
    
    if (!request) {
      throw new Error('Solicitação não encontrada')
    }

    if (request.type === 'user_registration') {
      await UserRepository.updateUserRole(request.userId, 'USER')
    }

    return RequestRepository.updateRequestStatus(requestId, 'APPROVED', adminId)
  }

  async rejectRequest(requestId, adminId) {
    return RequestRepository.updateRequestStatus(requestId, 'REFUSED', adminId)
  }
}

module.exports = new RequestService()
