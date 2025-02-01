import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        _dark: {
          bg: 'gray.900',
          color: 'whiteAlpha.900'
        }
      }
    }
  },
  colors: {
    brand: {
      50: '#f5f3ff',
      100: '#ede9fe',
      500: '#6366f1',
      900: '#312e81',
    }
  },
  components: {
    Button: {
      baseStyle: {
        _dark: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.900'
          }
        }
      }
    }
  }
})

export default theme
