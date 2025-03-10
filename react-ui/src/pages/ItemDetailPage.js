// pages/ItemDetailPage.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Image, 
  Link as ChakraLink,
  Button,
  VStack,
  HStack,
  Badge,
  Divider,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center,
  SimpleGrid
} from '@chakra-ui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ExternalLinkIcon, EditIcon, DeleteIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isAdmin] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/items/${id}`);
        setItem(response.data);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. The item may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (process.env.REACT_APP_NODE_ENV === 'production' && !isAdmin) {
      toast({
        title: "Delete failed",
        description: "No permission to delete the item",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsDeleteAlertOpen(false);
    } else {
      try {
        await axios.delete(`/api/items/${id}`);

        toast({
          title: "Item deleted",
          description: "The item has been successfully removed",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate('/');
      } catch (error) {
        console.error('Error deleting item:', error);

        toast({
          title: "Delete failed",
          description: error.response?.data?.error || "Failed to delete the item",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsDeleteAlertOpen(false);
      }
    }
  };

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

  if (error || !item) {
    return (
      <Box textAlign="center" py={10}>
        <Heading mb={4} size="lg">Item Not Found</Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          {error || "This item does not exist or has been removed."}
        </Text>
        <Button as={Link} to="/" colorScheme="red">
          Return to Home
        </Button>
      </Box>
    );
  }

  const imageUrl = `${item.imagePath}`;

  return (
    <Box>
      <Breadcrumb 
        separator={<ChevronRightIcon color="gray.500" />}
        mb={8}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{item.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box>
          <Image 
            src={imageUrl} 
            alt={item.name} 
            borderRadius="md" 
            objectFit="cover"
            w="100%"
            maxH="500px"
          />
        </Box>
        
        <VStack align="flex-start" spacing={4}>
          <Badge colorScheme="red" fontSize="md" px={2} py={1}>
            Made in Canada
          </Badge>
          
          <Heading size="xl">{item.name}</Heading>
          
          <Divider />
          
          <Text fontSize="lg" whiteSpace="pre-line">
            {item.description}
          </Text>
          
          <Box bg="gray.50" p={4} borderRadius="md" w="100%">
            <Heading size="sm" mb={2}>Proof of Canadian Origin:</Heading>
            <Text whiteSpace="pre-line">{item.proofOfOrigin}</Text>
          </Box>
          
          <ChakraLink 
            href={item.purchaseLink} 
            isExternal 
            colorScheme="red"
            fontWeight="bold"
            fontSize="lg"
            mt={2}
          >
            Visit Store to Purchase <ExternalLinkIcon mx="2px" />
          </ChakraLink>
          
          <Divider />
          
          <HStack spacing={4}>
            <Button
              leftIcon={<EditIcon />}
              colorScheme="blue"
              as={Link}
              to={`/edit-item/${item._id}`}
            >
              Edit
            </Button>
            
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              onClick={() => setIsDeleteAlertOpen(true)}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </SimpleGrid>
      
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Item
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ItemDetailPage;