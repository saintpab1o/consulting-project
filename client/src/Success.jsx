// client/src/Success.jsx

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function Success() {
  return (
    <Box
      w="full"
      minH="100vh"
      bg="black"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box textAlign="center">
        <Heading mb={4}>Payment Successful!</Heading>
        <Text fontSize="lg" color="gray.300">
          Thank you for your purchase. We’ll contact you soon with next steps.
        </Text>
      </Box>
    </Box>
  );
}

export default Success;
