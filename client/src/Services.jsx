// client/src/Services.jsx

import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Select,
  Button,
  VStack,
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

function Services() {
  // -----------------------------------------
  // STATE FOR THE 3 SERVICE CARDS
  // -----------------------------------------
  const [artistTier, setArtistTier] = useState('3');           // Artist mgmt
  const [consultingHours, setConsultingHours] = useState('1'); // Consulting
  const [techOption] = useState('Free Consultation');          // Tech

  // We'll track which "service_type" the user is booking for the 3-card modal
  const [serviceType, setServiceType] = useState('');

  // Booking form data & submission response (for the 3 cards)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    isOpen: isServiceModalOpen,
    onOpen: onServiceModalOpen,
    onClose: onServiceModalClose
  } = useDisclosure();

  // For the "Book Now" buttons
  const handleBookNow = (product) => {
    let finalServiceType = '';
    if (product === 'Artist') {
      finalServiceType = `Artist Management (${artistTier} months)`;
    } else if (product === 'Consulting') {
      finalServiceType = `General Consulting (${consultingHours} hrs)`;
    } else if (product === 'Tech') {
      finalServiceType = `Tech / Development (${techOption})`;
    }
    setServiceType(finalServiceType);

    // Reset fields & messages
    setFormData({ name: '', email: '', phone: '' });
    setSubmitMessage('');

    onServiceModalOpen();
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: serviceType
      };

      const response = await fetch('http://localhost:5000/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  // -----------------------------------------
  // FREE CONSULTATION BUTTON & MODAL
  // -----------------------------------------
  const {
    isOpen: isConsultModalOpen,
    onOpen: onConsultModalOpen,
    onClose: onConsultModalClose
  } = useDisclosure();

  const [consultFormData, setConsultFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: 'Free Consultation'
  });
  const [consultSubmitMessage, setConsultSubmitMessage] = useState('');

  const handleConsultChange = (e) => {
    const { name, value } = e.target;
    setConsultFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultFormData),
      });
      const data = await response.json();

      if (response.ok) {
        setConsultSubmitMessage('Thank you! Your booking was submitted successfully.');
      } else {
        setConsultSubmitMessage(`Error: ${data.error || 'Could not submit booking'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setConsultSubmitMessage('Submission failed. Try again later.');
    }
  };

  return (
    <Box w="full" minH="100vh" display="flex" flexDirection="column" bg="black">
      {/* 
        HERO / BACKGROUND SECTION 
        (Dark & blurred background image)
      */}
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        // Reduced hero height for more space below
        h={{ base: '40vh', md: '45vh' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Tech Background"
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          objectFit="cover"
          // Blurred & darkened
          filter="blur(4px) brightness(0.5)"
          zIndex={0}
        />

        {/* Hero text/heading */}
        <Box textAlign="center" zIndex={1} px={4} maxW="2xl">
          <Heading
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="extrabold"
            color="white"
            mb={6}
          >
            Our Services
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.200"
            mb={8}
            fontWeight="light"
          >
            Explore our range of solutions to meet your unique needs.
          </Text>

          {/* FREE CONSULTATION BUTTON under "Our Services" */}
          <Button
            bg="red.500"
            color="white"
            size="lg"
            _hover={{ bg: 'red.400' }}
            boxShadow="xl"
            onClick={onConsultModalOpen}
          >
            Free Consultation
          </Button>
        </Box>
      </Box>

      {/* SERVICE CARDS SECTION */}
      <Flex
        justify="center"
        align="flex-start"
        wrap="wrap"
        gap={8}
        zIndex={2}
        // Increase the negative margin to raise the cards higher
        mt={-16}
        px={4}
      >
        {/* 1) Artist Management Card */}
        <VStack
          w="280px"
          minH="580px"
          p={4}
          bg="rgba(0, 0, 0, 0.7)"
          borderRadius="md"
          boxShadow="xl"
          spacing={4}
        >
          <Image
            src="https://media.istockphoto.com/id/156430452/photo/dj-silhouette.jpg?s=2048x2048&w=is&k=20&c=YxZ43DrD6B9K8bBFZtoBw-lzlYZ1FPtSp8NzD2y6nKk="
            alt="Artist Management"
            borderRadius="md"
            w="full"
            h="180px"
            objectFit="cover"
          />
          <Heading as="h3" size="md" color="white">
            Artist Management
          </Heading>
          <Text color="gray.300" fontSize="sm" textAlign="center">
            Professional management of artists with flexible monthly tiers.
          </Text>

          <Box w="full">
            <Text color="gray.200" mb={1}>Choose Duration:</Text>
            <Select
              value={artistTier}
              onChange={(e) => setArtistTier(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _focus={{ borderColor: 'red.400' }}
            >
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="9">9 months</option>
              <option value="12">12 months</option>
            </Select>
          </Box>

          <Text color="gray.200">
            Price: <strong>$999</strong> (example)
          </Text>
          <Button colorScheme="red" onClick={() => handleBookNow('Artist')}>
            Book Now
          </Button>
        </VStack>

        {/* 2) General Consulting Card */}
        <VStack
          w="280px"
          minH="580px"
          p={4}
          bg="rgba(0, 0, 0, 0.7)"
          borderRadius="md"
          boxShadow="xl"
          spacing={4}
        >
          <Image
            src="https://media.istockphoto.com/id/2162645329/photo/teamwork-meeting-and-ideas-for-solution-or-decision-for-business-workplace-or-company-group.jpg?s=2048x2048&w=is&k=20&c=q1iXPBR8YHgGpvmwyrrnXhuqZWfRtoXMVoWJbyHe5b4="
            alt="General Consulting"
            borderRadius="md"
            w="full"
            h="180px"
            objectFit="cover"
          />
          <Heading as="h3" size="md" color="white">
            General Consulting
          </Heading>
          <Text color="gray.300" fontSize="sm" textAlign="center">
            Expert advice and solutions for various business challenges.
          </Text>

          <Box w="full">
            <Text color="gray.200" mb={1}>Choose Hours:</Text>
            <Select
              value={consultingHours}
              onChange={(e) => setConsultingHours(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _focus={{ borderColor: 'red.400' }}
            >
              <option value="1">1 hour</option>
              <option value="4">4 hours</option>
              <option value="8">8 hours</option>
            </Select>
          </Box>

          <Text color="gray.200">
            Price: <strong>$199/hr</strong> (example)
          </Text>
          <Button colorScheme="red" onClick={() => handleBookNow('Consulting')}>
            Book Now
          </Button>
        </VStack>

        {/* 3) Tech / Development Card */}
        <VStack
          w="280px"
          minH="580px"
          p={4}
          bg="rgba(0, 0, 0, 0.7)"
          borderRadius="md"
          boxShadow="xl"
          spacing={4}
        >
          <Image
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Tech / Development"
            borderRadius="md"
            w="full"
            h="180px"
            objectFit="cover"
          />
          <Heading as="h3" size="md" color="white">
            Tech / Development
          </Heading>
          <Text color="gray.300" fontSize="sm" textAlign="center">
            End-to-end software development and technical solutions.
          </Text>

          <Box w="full">
            <Text color="gray.200" mb={1}>Consultation:</Text>
            <Select
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _focus={{ borderColor: 'red.400' }}
              isReadOnly
              cursor="not-allowed"
            >
              <option value="free">Free Consultation</option>
            </Select>
          </Box>

          <Text color="gray.200">Price: <strong>Custom Quote</strong></Text>
          <Button colorScheme="red" onClick={() => handleBookNow('Tech')}>
            Book Now
          </Button>
        </VStack>
      </Flex>

      {/* MODAL for the 3 SERVICE CARDS */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setServiceType('');
          setSubmitMessage('');
          onServiceModalClose();
        }}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent
          bgGradient="linear(to-br, #1a1a1a, #2a2a2a)"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="2xl"
          boxShadow="dark-lg"
        >
          <ModalHeader borderBottomWidth="1px" borderColor="gray.600" color="red.300">
            Book Service
          </ModalHeader>
          <ModalCloseButton color="gray.200" />

          <ModalBody pb={6}>
            <Text color="gray.100" mb={4}>
              Booking for: <strong>{serviceType || 'No Service Selected'}</strong>
            </Text>
            <form id="serviceBookingForm" onSubmit={handleServiceSubmit}>
              <FormControl mb={4}>
                <FormLabel color="gray.200">Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
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
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                setServiceType('');
                setSubmitMessage('');
                onServiceModalClose();
              }}
              color="gray.300"
            >
              Cancel
            </Button>
            <Button
              form="serviceBookingForm"
              type="submit"
              bg="red.500"
              color="white"
              _hover={{ bg: 'red.400' }}
              onClick={handleServiceSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL for the FREE CONSULTATION BUTTON */}
      <Modal
        isOpen={isConsultModalOpen}
        onClose={onConsultModalClose}
        isCentered
        size="lg"
      >
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
            <form id="consultForm" onSubmit={handleConsultSubmit}>
              <FormControl mb={4}>
                <FormLabel color="gray.200">Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={consultFormData.name}
                  onChange={handleConsultChange}
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
                  value={consultFormData.email}
                  onChange={handleConsultChange}
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
                  value={consultFormData.phone}
                  onChange={handleConsultChange}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="gray.200"
                  _focus={{ borderColor: 'red.400' }}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel color="gray.200">
                  Type of Service (Max 20 chars)
                </FormLabel>
                <Input
                  type="text"
                  name="service_type"
                  maxLength={20}
                  value={consultFormData.service_type}
                  onChange={handleConsultChange}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="gray.200"
                  _focus={{ borderColor: 'red.400' }}
                />
              </FormControl>
            </form>

            {consultSubmitMessage && (
              <Text
                mt={2}
                fontWeight="bold"
                color={
                  consultSubmitMessage.startsWith('Thank')
                    ? 'green.400'
                    : 'red.300'
                }
              >
                {consultSubmitMessage}
              </Text>
            )}
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor="gray.600">
            <Button
              variant="ghost"
              mr={3}
              onClick={onConsultModalClose}
              color="gray.300"
            >
              Cancel
            </Button>
            <Button
              form="consultForm"
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

export default Services;
