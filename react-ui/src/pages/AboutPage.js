// pages/AboutPage.js
import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack,
  Image,
  Container,
  Divider,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';

const AboutPage = () => {
  return (
    <Box>
      <VStack spacing={8} align="center" mb={10}>
        <Heading 
          as="h1" 
          size="2xl" 
          textAlign="center"
          color="red.600"
          mx="auto"
        >
          About Made in Canada
        </Heading>
        
        <Divider maxW="200px" borderColor="red.300" borderWidth="2px" />
        
        <Container maxW="container.md">
          <Flex justifyContent="center" alignItems="center" width="100%" my={6}>
            <Image 
              src="/Flag_map_of_Canada.png" 
              alt="Map of Canada with flag" 
              maxH="200px" 
              alignSelf="center"
              my={6}
            />
          </Flex>
          
          <VStack spacing={6} align="start" textAlign="left">
            <Heading size="lg" color="red.500">Our Mission</Heading>
            <Text fontSize="lg">
              Made in Canada is a platform dedicated to showcasing and supporting products manufactured in Canada. 
              Our goal is to make it easier for consumers to find and support local businesses, strengthening our 
              national economy and reducing our environmental footprint.
            </Text>
            
            <Heading size="lg" color="red.500">Why Buy Canadian?</Heading>
            <Text fontSize="lg">
              In today's global economy, international tariffs and trade wars have significantly impacted Canadian 
              businesses and consumers. Recent years have seen increased tariffs on Canadian exports to major trade 
              partners, while retaliatory measures have raised prices on imported goods. These economic tensions have 
              disrupted supply chains, increased consumer costs, and created uncertainty for many Canadian industries.
            </Text>
            
            <Text fontSize="lg">
              By choosing to buy products made in Canada, we can help insulate our economy from these external 
              pressures. Supporting local businesses creates jobs, keeps money circulating within our communities, 
              and builds resilience in our economy. Canadian-made products often have a smaller carbon footprint due 
              to reduced shipping distances, and they're manufactured under Canada's high labor and environmental standards.
            </Text>
            
            <Text fontSize="lg">
              Additionally, many Canadian companies have been innovating to reduce reliance on imported materials and 
              components, creating opportunities for growth in domestic manufacturing. When we choose to buy Canadian, 
              we're not just getting quality products – we're investing in our country's economic future and sustainability.
            </Text>
            
            <Heading size="lg" color="red.500">Join Our Community</Heading>
            <Text fontSize="lg">
              Whether you're a proud Canadian manufacturer or a consumer looking to support local businesses, 
              we invite you to join our community. Add your favorite Canadian products to our database or 
              discover new local alternatives to imported goods. Together, we can strengthen Canada's economy 
              and promote sustainable local commerce.
            </Text>
          </VStack>
        </Container>
      </VStack>
      
      <Flex 
        bg={useColorModeValue('red.50', 'red.900')} 
        p={6} 
        borderRadius="md" 
        direction="column" 
        align="center"
        textAlign="center"
      >
        <Heading size="md" mb={3}>
          "Supporting local businesses today builds a stronger Canada for tomorrow."
        </Heading>
        <Text fontStyle="italic">
          Every purchase is a vote for the kind of world you want to live in.
        </Text>
      </Flex>
    </Box>
  );
};

export default AboutPage;