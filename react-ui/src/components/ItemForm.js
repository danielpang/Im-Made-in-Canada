import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Button, 
  Stack,
  useToast,
  FormErrorMessage,
  Image,
  Text
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const ItemForm = ({ initialValues = {}, onSubmit, submitButtonText = 'Submit' }) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    purchaseLink: initialValues.purchaseLink || '',
    description: initialValues.description || '',
    proofOfOrigin: initialValues.proofOfOrigin || '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialValues.imagePath || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageChange = async (e) => {
    const productImageFile = e.target.files[0];
    if (productImageFile) {
      setImageFile(productImageFile);
      const uuid = crypto.randomUUID();
      const uploadedFileName = uuid + URL.createObjectURL(productImageFile);

      const { error } = await supabase
        .storage
        .from('product-images')
        .upload(`public/${uploadedFileName}`, productImageFile, {
          cacheControl: '3600',
          upsert: true
        })

      const response = await supabase
        .storage
        .from('product-images')
        .getPublicUrl(`public/${uploadedFileName}`)

      if (response.data.publicUrl) {
        setPreviewUrl(response.data.publicUrl);
      }

      if (errors.image || error) {
        setErrors({
          ...errors,
          image: null
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.purchaseLink.trim()) {
      newErrors.purchaseLink = 'Purchase link is required';
    } 
    // else if (!/^https?:\/\/.+/.test(formData.purchaseLink)) {
    //   newErrors.purchaseLink = 'Must be a valid URL starting with http:// or https://';
    // }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.proofOfOrigin.trim()) {
      newErrors.proofOfOrigin = 'Proof of Canadian origin is required';
    }
    
    // if (!imageFile && !initialValues.imagePath) {
    //   newErrors.image = 'Image is required';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form has errors",
        description: "Please check the form and fix the errors",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('purchaseLink', formData.purchaseLink);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('proofOfOrigin', formData.proofOfOrigin);
      
      if (imageFile) {
        formDataToSend.append('imageURL', previewUrl);
      }

      await onSubmit(formDataToSend);
      
      toast({
        title: "Success!",
        description: initialValues._id ? "Item updated successfully" : "Item added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit}
      bg="white" 
      p={6} 
      borderRadius="md"
      boxShadow="md"
    >
      <Stack spacing={4}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Item Name</FormLabel>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.purchaseLink}>
          <FormLabel htmlFor="purchaseLink">Purchase Link</FormLabel>
          <Input
            id="purchaseLink"
            name="purchaseLink"
            value={formData.purchaseLink}
            onChange={handleChange}
            placeholder="https://example.com/product"
          />
          <FormErrorMessage>{errors.purchaseLink}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.image}>
          <FormLabel htmlFor="image">Product Image</FormLabel>
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            p={1}
          />
          <FormErrorMessage>{errors.image}</FormErrorMessage>
          
          {previewUrl && (
            <Box mt={2}>
              <Image 
                src={previewUrl.startsWith('blob:') ? previewUrl : `${previewUrl}`}
                alt="Product preview"
                maxH="200px"
                borderRadius="md"
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                {initialValues.imagePath && !imageFile ? "Current image" : "Preview"}
              </Text>
            </Box>
          )}
        </FormControl>

        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the product"
            rows={4}
          />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.proofOfOrigin}>
          <FormLabel htmlFor="proofOfOrigin">Proof of Canadian Origin</FormLabel>
          <Textarea
            id="proofOfOrigin"
            name="proofOfOrigin"
            value={formData.proofOfOrigin}
            onChange={handleChange}
            placeholder="Provide evidence that this item is made in Canada"
            rows={3}
          />
          <FormErrorMessage>{errors.proofOfOrigin}</FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          colorScheme="red"
          isLoading={isSubmitting}
          type="submit"
          size="lg"
        >
          {submitButtonText}
        </Button>
      </Stack>
    </Box>
  );
};

export default ItemForm;