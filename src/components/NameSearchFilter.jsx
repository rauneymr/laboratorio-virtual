import React from 'react'
import { 
  InputGroup, 
  InputLeftElement, 
  Input 
} from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'

/**
 * Reusable name search filter component
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {function} props.onSearchChange - Callback function when search value changes
 * @param {string} [props.value] - Controlled input value (optional)
 */
const NameSearchFilter = ({ 
  placeholder = "Buscar por nome", 
  onSearchChange, 
  value,
  ...rest 
}) => {
  const handleSearchChange = (e) => {
    const searchValue = e.target.value
    onSearchChange(searchValue)
  }

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <FaSearch color="gray.300" />
      </InputLeftElement>
      <Input 
        placeholder={placeholder}
        onChange={handleSearchChange}
        value={value}
        {...rest}
      />
    </InputGroup>
  )
}

export default NameSearchFilter
