import React from 'react';
import { 
  Box, 
  Image, 
  Text, 
  Heading, 
  Stack,
  Link as ChakraLink,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const ItemCard = ({ item }) => {
  const baseUrl = 'http://localhost:5000'; // Replace with your actual backend URL in production
  const imageUrl = `${baseUrl}${item.imagePath}`;

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg={useColorModeValue('white', 'gray.700')}
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}
    >
      <Link to={`/item/${item._id}`}>
        <Image 
          src={imageUrl} 
          alt={item.name} 
          w="100%" 
          h="200px" 
          objectFit="cover" 
        />
      </Link>

      <Box p={5}>
        <Stack spacing={2}>
          <Badge colorScheme="red" alignSelf="flex-start">
            Made in Canada
          </Badge>
          
          <Link to={`/item/${item._id}`}>
            <Heading size="md" noOfLines={1}>{item.name}</Heading>
          </Link>
          
          <Text noOfLines={2} color={useColorModeValue('gray.600', 'gray.300')}>
            {item.description}
          </Text>
          
          <ChakraLink 
            href={item.purchaseLink} 
            isExternal 
            color="red.500"
            fontWeight="medium"
          >
            View Product <ExternalLinkIcon mx="2px" />
          </ChakraLink>
        </Stack>
      </Box>
    </Box>
  );
};

export default ItemCard;