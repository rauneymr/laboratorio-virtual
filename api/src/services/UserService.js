const UserRepository = require('../repositories/UserRepository');
const { UserSchema } = require('../models/User');
const bcrypt = require('bcrypt');

class UserService {
  async create(userData) {
    const { email, name, password, role } = UserSchema.parse(userData);
    
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    return UserRepository.create({
      email,
      name,
      password: hashedPassword,
      role
    });
  }

  async findAll() {
    return UserRepository.findAll();
  }

  async findById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(id, userData) {
    const { email, name, role } = userData;
    return UserRepository.update(id, { email, name, role });
  }

  async delete(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return UserRepository.delete(id);
  }
}

module.exports = new UserService();
