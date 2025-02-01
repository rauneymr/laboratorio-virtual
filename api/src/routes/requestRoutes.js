const express = require('express')
const RequestController = require('../controllers/RequestController')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router()

// Schedule Request Routes
router.post('/schedule', 
  authMiddleware, 
  RequestController.createScheduleRequest
)

// Registration Request Routes
router.post('/registration', 
  authMiddleware, 
  RequestController.createRegistrationRequest
)

// Admin Request Management Routes
router.get('/pending', 
  authMiddleware, 
  adminMiddleware, 
  RequestController.getPendingRequests
)

router.put('/:requestId/approve', 
  authMiddleware, 
  adminMiddleware, 
  RequestController.approveRequest
)

router.put('/:requestId/reject', 
  authMiddleware, 
  adminMiddleware, 
  RequestController.rejectRequest
)

module.exports = router
