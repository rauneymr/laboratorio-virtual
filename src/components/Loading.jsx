import { Flex, Spinner } from '@chakra-ui/react'

const Loading = ({ size = 'xl', color = 'blue.500', fullScreen = true }) => {
  const spinnerProps = {
    thickness: '4px',
    speed: '0.65s',
    emptyColor: 'gray.200',
    color: color,
    size: size
  }

  return (
    <Flex 
      justifyContent="center" 
      alignItems="center" 
      height={fullScreen ? '100vh' : '100%'}
      width="full"
    >
      <Spinner {...spinnerProps} />
    </Flex>
  )
}

export default Loading
