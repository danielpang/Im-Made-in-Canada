import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Spinner,
  Text,
  Button
} from '@chakra-ui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
import ItemForm from '../components/ItemForm';
import axios from 'axios';

const EditItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleSubmit = async (formData) => {
    try {
      await axios.put(`/api/items/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      navigate(`/item/${id}`);
    } catch (error) {
      console.error('Error updating item:', error);
      throw new Error(error.response?.data?.error || 'Failed to update item');
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

  return (
    <Box>
      <Breadcrumb 
        separator={<ChevronRightIcon color="gray.500" />}
        mb={8}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to={`/item/${id}`}>{item.name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <Heading mb={6}>Edit: {item.name}</Heading>
      
      <ItemForm 
        initialValues={item}
        onSubmit={handleSubmit} 
        submitButtonText="Update Product"
      />
    </Box>
  );
};

export default EditItemPage;