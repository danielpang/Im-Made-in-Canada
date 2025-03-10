// components/Footer.js
import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box 
      as="footer" 
      py={6}
      mt={10}
      borderTop="1px solid"
      borderColor="gray.200"
    >
      <Center>
        <Text fontSize="sm" color="gray.600">
          Made in Toronto with love <span role="img" aria-label="love">❤️</span>
        </Text>
      </Center>
    </Box>
  );
};

export default Footer;