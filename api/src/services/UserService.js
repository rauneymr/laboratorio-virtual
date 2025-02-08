const UserRepository = require('../repositories/UserRepository');
const { UserSchema } = require('../models/User');
const RequestService = require('./RequestService');
const bcrypt = require('bcrypt');

class UserService {
  async create(userData) {
    const { email, name, password, role = 'USER', status = 'PENDING' } = UserSchema.parse(userData);
    
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserRepository.create({
      email,
      name,
      password: hashedPassword,
      role,
      status
    });

    // Create registration request for the user
    await RequestService.createRegistrationRequest(user.id);

    return user;
  }

  async findAll() {
    return UserRepository.findAll();
  }

  async findById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }

  async update(id, userData) {
    const { email, name, role, status } = userData;
    const updatedUser = await UserRepository.update(id, { 
      email, 
      name, 
      role, 
      status 
    });

    if (!updatedUser) {
      throw new Error('Falha ao atualizar usuário');
    }

    return updatedUser;
  }

  async delete(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return UserRepository.delete(id);
  }

  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Remove sensitive information
    const { password, ...profileData } = user;
    return profileData;
  }

  async updateProfile(userId, profileData) {
    const { name, email } = profileData;

    // Validate input
    if (!name && !email) {
      throw new Error('Pelo menos um campo deve ser atualizado');
    }

    const updatedUser = await UserRepository.update(userId, { 
      name, 
      email 
    });

    if (!updatedUser) {
      throw new Error('Falha ao atualizar perfil');
    }

    // Remove sensitive information
    const { password, ...profileResponse } = updatedUser;
    return profileResponse;
  }

  async updateUserRole(id, role) {
    // Validate the role
    const validatedRole = UserSchema.shape.role.parse(role);

    // Find the user first to ensure they exist
    const user = await this.findById(id);

    // Update the user's role
    return UserRepository.updateUserRole(id, validatedRole);
  }

  async updateUserStatus(id, status) {
    // Validate the status
    const validatedStatus = UserSchema.shape.status.parse(status);

    // Find the user first to ensure they exist
    const user = await this.findById(id);

    // Update the user's status
    return UserRepository.updateUserStatus(id, validatedStatus);
  }
}

module.exports = new UserService();
