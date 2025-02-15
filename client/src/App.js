// client/src/App.js

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import Home from './Home';
import Services from './Services';
import Cart from './Cart';
import Success from './Success';

function App() {
  const navBg = 'rgba(0,0,0,0.7)';
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
          PR Consulting
          <Box as="span" color="red.400" ml={1}>
            Group
          </Box>
        </Heading>

        <Flex gap={6} fontWeight="medium" fontSize="lg">
          <Box as={Link} to="/" cursor="pointer" _hover={{ color: 'red.300' }}>
            Home
          </Box>
          <Box as={Link} to="/services" cursor="pointer" _hover={{ color: 'red.300' }}>
            Services
          </Box>
          <Box as={Link} to="/cart" cursor="pointer" _hover={{ color: 'red.300' }}>
            Cart
          </Box>
          <Box cursor="pointer" _hover={{ color: 'red.300' }}>About</Box>
          <Box cursor="pointer" _hover={{ color: 'red.300' }}>Contact</Box>
        </Flex>
      </Flex>

      {/* ROUTES */}
      <Box flexGrow={1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Box>

      {/* FOOTER */}
      <Box bg="gray.900" color="gray.100" py={4} textAlign="center">
        © {new Date().getFullYear()} PR Consulting Group. All rights reserved.
      </Box>
    </Box>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
