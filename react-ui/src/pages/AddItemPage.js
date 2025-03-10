import React from 'react';
import { 
  Box, 
  Heading,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
import ItemForm from '../components/ItemForm';
import axios from 'axios';

const AddItemPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await axios.post('api/items', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error adding item:', error);
      throw new Error(error.response?.data?.error || 'Failed to add item');
    }
  };

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
          <BreadcrumbLink>Add Item</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <Heading mb={6}>Add a New Canadian Product</Heading>
      
      <ItemForm 
        onSubmit={handleSubmit} 
        submitButtonText="Add Product"
      />
    </Box>
  );
};

export default AddItemPage;