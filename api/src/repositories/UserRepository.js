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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    return prisma.user.findUnique({
      where: { id: userId },
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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    return prisma.user.update({
      where: { id: userId },
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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    return prisma.user.update({
      where: { id: userId },
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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    return prisma.user.update({
      where: { id: userId },
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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    return prisma.user.delete({
      where: { id: userId }
    });
  }

  async disableUser(id, reason = '') {
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    console.log(`[UserRepository] Disabling user ${userId}`)
    return prisma.user.update({
      where: { id: userId },
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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    console.log(`[UserRepository] Enabling user ${userId}`)
    return prisma.user.update({
      where: { id: userId },
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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    console.log(`[UserRepository] Approving user ${userId}`)
    return prisma.user.update({
      where: { id: userId },
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
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    console.log(`[UserRepository] Rejecting user ${userId}`)
    return prisma.user.update({
      where: { id: userId },
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
