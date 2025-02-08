const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Request {
  static async create(data) {
    const requestData = {
      type: data.type,
      status: data.status,
      initialDate: data.initialDate ? new Date(data.initialDate) : undefined,
      finalDate: data.finalDate ? new Date(data.finalDate) : undefined,
      date: data.date,
      time: data.time,
      approvedBy: data.approvedBy,
      comments: data.comments
    }

    // If userId is provided, connect the user
    if (data.userId) {
      requestData.user = {
        connect: { id: data.userId }
      }
    }

    // If workbenchId is provided, connect the workbench
    if (data.workbenchId) {
      requestData.workbench = {
        connect: { id: data.workbenchId }
      }
    }

    return prisma.request.create({ 
      data: requestData
    })
  }

  static async findById(id) {
    return prisma.request.findUnique({ where: { id } })
  }

  static async findAll(filters = {}) {
    return prisma.request.findMany({
      where: filters,
      include: {
        user: true,
        workbench: true
      }
    })
  }

  static async update(id, data) {
    // Rename adminId to approvedBy if present
    if (data.adminId !== undefined) {
      data.approvedBy = data.adminId;
      delete data.adminId;
    }

    return prisma.request.update({
      where: { id },
      data
    })
  }

  static async delete(id) {
    return prisma.request.delete({ where: { id } })
  }

  static async getPendingRequests(type = null) {
    const whereCondition = {
      status: 'PENDING',
      ...(type && { type })
    }

    return prisma.request.findMany({
      where: whereCondition,
      include: {
        user: true,
        workbench: true
      }
    })
  }
}

module.exports = Request
