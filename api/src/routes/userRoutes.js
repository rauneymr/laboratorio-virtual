const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/', UserController.create);
router.get('/', UserController.findAll);
router.get('/:id', UserController.findById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
