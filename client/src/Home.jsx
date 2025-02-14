// client/src/Home.jsx

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
  Input
} from '@chakra-ui/react';

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    <Box w="full" minH="100vh" display="flex" flexDirection="column" bg="black">
      {/* HERO SECTION */}
      <Box
        flexGrow={1}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
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
    </Box>
  );
}

export default Home;
