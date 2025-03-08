import React, { useState, useEffect } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Heading, 
  Text,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import ItemCard from '../components/ItemCard';
import axios from 'axios';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('api/items');
        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <Center h="400px">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="red.500"
          size="xl"
        />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert 
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="400px"
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error Loading Items
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading mb={4}>Made in Canada Products</Heading>
        <Text fontSize="lg" color="gray.600">
          No items have been added yet. Be the first to add a Canadian-made product!
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading mb={8} textAlign="center">Made in Canada Products</Heading>
      
      <SimpleGrid 
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
        spacing={6}
      >
        {items.map(item => (
          <ItemCard key={item._id} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;