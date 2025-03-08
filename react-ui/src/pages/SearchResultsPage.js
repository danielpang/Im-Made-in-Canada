import React, { useState, useEffect } from 'react';
import { 
  Box, 
  SimpleGrid, 
  Heading, 
  Text,
  Center,
  Spinner,
  Button,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import ItemCard from '../components/ItemCard';
import axios from 'axios';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/items/search?query=${encodeURIComponent(query)}`);
        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error searching items:', err);
        setError('Failed to load search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const highlightColor = useColorModeValue('red.100', 'red.800');

  if (!query.trim()) {
    return (
      <Box textAlign="center" py={10}>
        <Heading mb={4}>Search Results</Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          Please enter a search term to find Canadian-made products.
        </Text>
        <Button as={Link} to="/" colorScheme="red">
          Return to Home
        </Button>
      </Box>
    );
  }

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
      <Box textAlign="center" py={10}>
        <Heading mb={4} size="lg">Error</Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          {error}
        </Text>
        <Button as={Link} to="/" colorScheme="red">
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex direction="column" mb={8}>
        <Button 
          as={Link} 
          to="/"
          leftIcon={<ChevronLeftIcon />}
          colorScheme="gray"
          variant="outline"
          alignSelf="flex-start"
          mb={4}
        >
          Back to Home
        </Button>
        
        <Heading mb={2}>Search Results</Heading>
        
        <Text fontSize="lg">
          Found {items.length} result{items.length !== 1 ? 's' : ''} for{' '}
          <Box as="span" bg={highlightColor} px={2} py={1} borderRadius="md" fontWeight="bold">
            "{query}"
          </Box>
        </Text>
      </Flex>
      
      {items.length === 0 ? (
        <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
          <Text fontSize="lg" mb={4}>
            No items found for your search. Try a different keyword.
          </Text>
          <Button as={Link} to="/add-item" colorScheme="red">
            Add a new Canadian product
          </Button>
        </Box>
      ) : (
        <SimpleGrid 
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
          spacing={6}
        >
          {items.map(item => (
            <ItemCard key={item._id} item={item} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default SearchResultsPage;