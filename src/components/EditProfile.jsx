import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast, Box, Button, Input, FormLabel } from '@chakra-ui/react';

const EditProfile = () => {
  const [userData, setUserData] = useState({
    address: '',
    phone_no: '',
    Father_name: '',
    Mother_name: '',
    Parents_phone_no: '',
    DOB: '',
    Photo: null,
  });
  
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserProfile = async () => {
      const token = JSON.parse(localStorage.getItem('newToken'));
      if (token && token.access) {
        try {
          const response = await axios.get('/proxy/user/profile/', {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          });
          setUserData(response.data); // Assuming response.data contains user info
        } catch (error) {
          toast({
            title: 'Error loading profile',
            description: 'Unable to load user profile data.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setUserData({ ...userData, Photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = JSON.parse(localStorage.getItem('newToken'));
    
    const formData = new FormData();
    formData.append('address', userData.address);
    formData.append('phone_no', userData.phone_no);
    formData.append('Father_name', userData.Father_name);
    formData.append('Mother_name', userData.Mother_name);
    formData.append('Parents_phone_no', userData.Parents_phone_no);
    formData.append('DOB', userData.DOB);
    if (userData.Photo) {
      formData.append('Photo', userData.Photo); // Append file only if there’s a new one
    }

    try {
      await axios.put('/proxy/user/update/', formData, {
        headers: {
          Authorization: `Bearer ${token.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.response ? error.response.data.message : 'An error occurred while updating the profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt="10">
      <form onSubmit={handleSubmit}>
        <FormLabel>Address</FormLabel>
        <Input
          name="address"
          value={userData.address}
          onChange={handleInputChange}
          mb={4}
          placeholder="Enter your address"
        />

        <FormLabel>Phone Number</FormLabel>
        <Input
          name="phone_no"
          value={userData.phone_no}
          onChange={handleInputChange}
          mb={4}
          placeholder="Enter your phone number"
        />

        <FormLabel>Father's Name</FormLabel>
        <Input
          name="Father_name"
          value={userData.Father_name}
          onChange={handleInputChange}
          mb={4}
          placeholder="Enter father's name"
        />

        <FormLabel>Mother's Name</FormLabel>
        <Input
          name="Mother_name"
          value={userData.Mother_name}
          onChange={handleInputChange}
          mb={4}
          placeholder="Enter mother's name"
        />

        <FormLabel>Parents' Phone Number</FormLabel>
        <Input
          name="Parents_phone_no"
          value={userData.Parents_phone_no}
          onChange={handleInputChange}
          mb={4}
          placeholder="Enter parents' phone number"
        />

        <FormLabel>Date of Birth</FormLabel>
        <Input
          name="DOB"
          type="date"
          value={userData.DOB}
          onChange={handleInputChange}
          mb={4}
        />

        <FormLabel>Profile Photo</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          mb={4}
        />

        <Button
          colorScheme="blue"
          type="submit"
          isLoading={loading}
          isDisabled={loading}
        >
          Update Profile
        </Button>
      </form>
    </Box>
  );
};

export default EditProfile;
