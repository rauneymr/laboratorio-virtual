const RequestService = require('../services/RequestService')

class RequestController {
  async createScheduleRequest(req, res) {
    try {
      const { workbenchId, startDate, endDate, description } = req.body
      const userId = req.user.id

      const request = await RequestService.createScheduleRequest(
        userId, 
        workbenchId, 
        startDate, 
        endDate, 
        description
      )

      res.status(201).json(request)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async createRegistrationRequest(req, res) {
    try {
      const userId = req.user.id
      const request = await RequestService.createRegistrationRequest(userId)
      res.status(201).json(request)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async getPendingRequests(req, res) {
    try {
      const { type } = req.query
      const requests = await RequestService.getPendingRequests(type)
      res.json(requests)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async approveRequest(req, res) {
    try {
      const { requestId } = req.params
      const adminId = req.user.id

      const approvedRequest = await RequestService.approveRequest(requestId, adminId)
      res.json(approvedRequest)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async rejectRequest(req, res) {
    try {
      const { requestId } = req.params
      const adminId = req.user.id

      const rejectedRequest = await RequestService.rejectRequest(requestId, adminId)
      res.json(rejectedRequest)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = new RequestController()
