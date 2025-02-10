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
  useColorModeValue,
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
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // Navbar styling
  const navBg = useColorModeValue('rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)');
  const navTextColor = useColorModeValue('gray.100', 'gray.50');

  return (
    <Box w="full" minH="100vh" display="flex" flexDirection="column" bg="black">
      {/* NAVBAR */}
      <Flex
        as="nav"
        bg={navBg}
        color={navTextColor}
        backdropFilter="blur(5px)"
        px={8}
        py={4}
        align="center"
        justify="space-between"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Heading fontSize="2xl">
          MyConsulting
          <Box as="span" color="red.400" ml={1}>
            Pro
          </Box>
        </Heading>

        <Flex gap={6} fontWeight="medium" fontSize="lg">
          <Box cursor="pointer" _hover={{ color: 'red.300' }}>Home</Box>
          <Box cursor="pointer" _hover={{ color: 'red.300' }}>Services</Box>
          <Box cursor="pointer" _hover={{ color: 'red.300' }}>About</Box>
          <Box cursor="pointer" _hover={{ color: 'red.300' }}>Contact</Box>
        </Flex>
      </Flex>

      {/* HERO SECTION */}
      <Box
        flexGrow={1}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Keyboard + red glow background image */}
        <Image
          src="https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Keyboard Glow"
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          objectFit="cover"
          zIndex={0}
        />

        {/* Strong overlay for better text contrast */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bgGradient="linear(to-r, blackAlpha.800, transparent)"
          zIndex={1}
        />

        <Box textAlign="center" zIndex={2} px={4} maxW="2xl">
          <Heading
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="extrabold"
            color="white"
            mb={6}
          >
            Ignite Your Business With Our Expertise
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.200"
            mb={8}
            fontWeight="light"
          >
            Cutting-edge solutions to help you power through your tech and beyond.
          </Text>
          <Button
            bg="red.500"
            color="white"
            size="lg"
            _hover={{ bg: 'red.400' }}
            boxShadow="xl"
            onClick={onOpen}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      {/* BOOKING FORM MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent
          bgGradient="linear(to-br, #1a1a1a, #2a2a2a)"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="2xl"
          boxShadow="dark-lg"
        >
          <ModalHeader borderBottomWidth="1px" borderColor="gray.600" color="red.300">
            Book a Quick Call
          </ModalHeader>
          <ModalCloseButton color="gray.200" />

          <ModalBody pb={6}>
            <form id="bookingForm" onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel color="gray.200">Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  bg="gray.800"
                  borderColor="gray.600"
                  color="gray.200"
                  _focus={{ borderColor: 'red.400' }}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel color="gray.200">Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  bg="gray.800"
                  borderColor="gray.600"
                  color="gray.200"
                  _focus={{ borderColor: 'red.400' }}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel color="gray.200">Phone</FormLabel>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="gray.200"
                  _focus={{ borderColor: 'red.400' }}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel color="gray.200">Type of Service (Max 20 chars)</FormLabel>
                <Input
                  type="text"
                  name="service_type"
                  maxLength={20}
                  value={formData.service_type}
                  onChange={handleChange}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="gray.200"
                  _focus={{ borderColor: 'red.400' }}
                />
              </FormControl>
            </form>

            {submitMessage && (
              <Text
                mt={2}
                fontWeight="bold"
                color={
                  submitMessage.startsWith('Thank')
                    ? 'green.400'
                    : 'red.300'
                }
              >
                {submitMessage}
              </Text>
            )}
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor="gray.600">
            <Button variant="ghost" mr={3} onClick={onClose} color="gray.300">
              Cancel
            </Button>
            <Button
              form="bookingForm"
              type="submit"
              bg="red.500"
              color="white"
              _hover={{ bg: 'red.400' }}
            >
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
