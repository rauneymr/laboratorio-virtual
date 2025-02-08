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
        createdAt: true,
        status: true
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
        role: true,
        status: true
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

  async disableUser(id, reason = '') {
    console.log(`[UserRepository] Disabling user ${id}`)
    return prisma.user.update({
      where: { id },
      data: { 
        status: 'DISABLED',
        disabledReason: reason,
        disabledAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true
      }
    });
  }

  async enableUser(id) {
    console.log(`[UserRepository] Enabling user ${id}`)
    return prisma.user.update({
      where: { id },
      data: { 
        status: 'PENDING',
        disabledReason: null,
        disabledAt: null
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true
      }
    });
  }

  async approveUser(id) {
    console.log(`[UserRepository] Approving user ${id}`)
    return prisma.user.update({
      where: { id },
      data: { 
        status: 'APPROVED',
        approvedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true
      }
    });
  }

  async rejectUser(id, reason = '') {
    console.log(`[UserRepository] Rejecting user ${id}`)
    return prisma.user.update({
      where: { id },
      data: { 
        status: 'DISABLED',
        rejectedReason: reason,
        rejectedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true
      }
    });
  }
}

module.exports = new UserRepository();
