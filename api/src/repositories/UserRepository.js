const prisma = require('../config/database');

class UserRepository {
  async create(userData) {
    return prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true
      }
    });
  }

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }

  async updateUserRole(id, role) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }

  async updateUserStatus(id, status) {
    return prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        status: true
      }
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id }
    });
  }
}

module.exports = new UserRepository();
