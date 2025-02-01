import api from './api'

const requestService = {
  async getPendingRequests(type = null) {
    try {
      const response = await api.get('/requests/pending', {
        params: { type }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching pending requests:', error)
      throw error
    }
  },

  async approveRequest(requestId) {
    try {
      const response = await api.put(`/requests/${requestId}/approve`)
      return response.data
    } catch (error) {
      console.error('Error approving request:', error)
      throw error
    }
  },

  async rejectRequest(requestId) {
    try {
      const response = await api.put(`/requests/${requestId}/reject`)
      return response.data
    } catch (error) {
      console.error('Error rejecting request:', error)
      throw error
    }
  },

  async createScheduleRequest(workbenchId, startDate, endDate, description) {
    try {
      const response = await api.post('/requests/schedule', {
        workbenchId,
        startDate,
        endDate,
        description
      })
      return response.data
    } catch (error) {
      console.error('Error creating schedule request:', error)
      throw error
    }
  },

  async createRegistrationRequest() {
    try {
      const response = await api.post('/requests/registration')
      return response.data
    } catch (error) {
      console.error('Error creating registration request:', error)
      throw error
    }
  }
}

export default requestService
