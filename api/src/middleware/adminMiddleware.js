const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Acesso não autorizado. Somente administradores podem realizar esta ação.' 
      })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = adminMiddleware
