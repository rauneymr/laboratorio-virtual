const UserService = require('../services/UserService');

class UserController {
  async create(req, res) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error('User creation error:', error);
      res.status(error.message === 'User already exists' ? 400 : 500)
         .json({ error: error.message || 'Failed to create user' });
    }
  }

  async findAll(req, res) {
    try {
      const users = await UserService.findAll();
      res.json(users);
    } catch (error) {
      console.error('Find all users error:', error);
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  }

  async findById(req, res) {
    try {
      const user = await UserService.findById(req.params.id);
      res.json(user);
    } catch (error) {
      console.error('Find user by ID error:', error);
      res.status(error.message === 'User not found' ? 404 : 500)
         .json({ error: error.message || 'Failed to retrieve user' });
    }
  }

  async update(req, res) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  async delete(req, res) {
    try {
      await UserService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(error.message === 'User not found' ? 404 : 500)
         .json({ error: error.message || 'Failed to delete user' });
    }
  }
}

module.exports = new UserController();
