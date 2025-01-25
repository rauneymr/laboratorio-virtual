const prisma = require('../config/database');
const { UserSchema } = require('../models/User');
const bcrypt = require('bcrypt');

class UserController {
  async create(req, res) {
    try {
      const { email, name, password, role } = UserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('User creation error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  async findAll(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });
      res.json(users);
    } catch (error) {
      console.error('Fetch users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Find user error:', error);
      res.status(500).json({ error: 'Failed to find user' });
    }
  }
}

module.exports = new UserController();
