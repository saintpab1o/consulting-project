// client/src/App.js

import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

function App() {
  // Chakra's modal disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Booking form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: ''
  });

  // Submission feedback
  const [submitMessage, setSubmitMessage] = useState('');

  // Track form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitMessage('Thank you! Your booking was submitted successfully.');
      } else {
        setSubmitMessage(`Error: ${data.error || 'Could not submit booking'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Submission failed. Try again later.');
    }
  };

  return (
    <Box w="full" minH="100vh" display="flex" flexDirection="column">
      {/* NAVBAR */}
      <Flex
        as="nav"
        bg="white"
        boxShadow="md"
        px={8}
        py={5}
        align="center"
        justify="space-between"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Heading fontSize="2xl" color="gray.800">
          MyConsulting
          <Box as="span" color="blue.600">Pro</Box>
        </Heading>

        <Flex gap={6} fontWeight="medium" color="gray.600" fontSize="lg">
          <Box cursor="pointer" _hover={{ color: 'blue.600' }}>Home</Box>
          <Box cursor="pointer" _hover={{ color: 'blue.600' }}>Services</Box>
          <Box cursor="pointer" _hover={{ color: 'blue.600' }}>About</Box>
          <Box cursor="pointer" _hover={{ color: 'blue.600' }}>Contact</Box>
        </Flex>
      </Flex>

      {/* HERO SECTION */}
      <Box
        flexGrow={1}
        position="relative"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Hero"
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          objectFit="cover"
          zIndex={0}
        />

        {/* Dark overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bgGradient="linear(to-r, blackAlpha.700, transparent)"
          zIndex={1}
        />

        <Box textAlign="center" zIndex={2} px={4} maxW="2xl">
          <Heading
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="extrabold"
            color="white"
            mb={6}
          >
            Elevate Your Business with Our Consulting Expertise
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.200"
            mb={8}
            fontWeight="light"
          >
            We provide cutting-edge solutions to help you succeed in tech and beyond.
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={onOpen}
            boxShadow="xl"
            _hover={{ boxShadow: 'md' }}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      {/* BOOKING FORM MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book a Quick Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="bookingForm" onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Type of Service (Max 20 chars)</FormLabel>
                <Input
                  type="text"
                  name="service_type"
                  maxLength={20}
                  value={formData.service_type}
                  onChange={handleChange}
                />
              </FormControl>
            </form>

            {submitMessage && (
              <Text
                mt={2}
                fontWeight="bold"
                color={
                  submitMessage.startsWith('Thank')
                    ? 'green.500'
                    : 'red.500'
                }
              >
                {submitMessage}
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button form="bookingForm" type="submit" colorScheme="blue">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* FOOTER */}
      <Box bg="gray.900" color="gray.100" py={4} textAlign="center">
        © {new Date().getFullYear()} MyConsultingPro. All rights reserved.
      </Box>
    </Box>
  );
}

export default App;
