import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Input, 
  InputGroup, 
  InputRightElement,
  useColorModeValue,
  Stack
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box 
      as="nav" 
      py={4} 
      px={8} 
      bg={useColorModeValue('white', 'gray.800')} 
      boxShadow="md"
    >
      <Flex 
        align="center" 
        justify="space-between" 
        wrap="wrap"
      >
        <Link to="/">
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color="red.500"
            display="flex"
            alignItems="center"
          >
            <span role="img" aria-label="Canadian flag" style={{ marginRight: '8px' }}>🇨🇦</span>
            Made in Canada
          </Text>
        </Link>

        <Stack 
          direction={{ base: 'column', md: 'row' }} 
          width={{ base: '100%', md: 'auto' }}
          align="center"
          spacing={4}
          mt={{ base: 4, md: 0 }}
        >
          <form onSubmit={handleSearch} style={{ width: '100%' }}>
            <InputGroup size="md">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={useColorModeValue('gray.100', 'gray.700')}
                borderRadius="full"
              />
              <InputRightElement>
                <Button 
                  h="1.75rem" 
                  size="sm" 
                  onClick={handleSearch}
                  borderRadius="full"
                  colorScheme="red"
                >
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
          
          <Link to="/add-item">
            <Button 
              colorScheme="red" 
              size="md"
              px={6}
            >
              Add Item
            </Button>
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;