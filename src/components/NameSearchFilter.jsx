import React from 'react'
import { 
  InputGroup, 
  InputLeftElement, 
  Input,
  useColorModeValue
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

  const iconColor = useColorModeValue('gray.400', 'gray.500')
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600')
  const placeholderColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <FaSearch color={iconColor} />
      </InputLeftElement>
      <Input 
        placeholder={placeholder}
        onChange={handleSearchChange}
        value={value}
        bg={inputBg}
        borderColor={inputBorderColor}
        _placeholder={{ color: placeholderColor }}
        {...rest}
      />
    </InputGroup>
  )
}

export default NameSearchFilter
