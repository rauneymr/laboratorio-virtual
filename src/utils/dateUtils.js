export const formatDateBR = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

export const formatDateTimeBR = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return dateString
  }
}
