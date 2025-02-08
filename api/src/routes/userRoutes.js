const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/', UserController.create);

// Protected routes (require authentication)
router.use(authMiddleware);

// Basic CRUD routes
router.get('/', UserController.findAll);
router.get('/:id', UserController.findById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

// Profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

// User management routes
router.patch('/:id/disable', UserController.disableUser);
router.patch('/:id/enable', UserController.enableUser);
router.patch('/:id/approve', UserController.approveUser);
router.patch('/:id/reject', UserController.rejectUser);

module.exports = router;
