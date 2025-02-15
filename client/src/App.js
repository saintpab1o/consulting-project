// client/src/App.js

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import HomeBase from './HomeBase'; // or './Home' if your file is named Home.jsx
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
        {/* LOGO / BRAND */}
        <Heading fontSize="2xl" whiteSpace="nowrap">
          PR Consulting
          <Box as="span" color="red.400" ml={1}>
            Group
          </Box>
        </Heading>

        {/* NAV LINKS */}
        <Flex
          gap={12}
          fontWeight="medium"
          fontSize="lg"
          alignItems="center"
        >
          {/* HOME LINK */}
          <Box
            as={Link}
            to="/"
            position="relative"
            cursor="pointer"
            _hover={{ color: 'red.300', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
          >
            Home
          </Box>

          {/* SERVICES LINK */}
          <Box
            as={Link}
            to="/services"
            position="relative"
            cursor="pointer"
            _hover={{ color: 'red.300', transform: 'scale(1.05)' }}
            transition="all 0.2s ease"
          >
            Services
          </Box>

          {/* CART ICON LINK */}
          <IconButton
            as={Link}
            to="/cart"
            icon={<FaShoppingCart />}
            variant="ghost"
            aria-label="Cart"
            fontSize="2xl"
            color="white"
            _hover={{ color: 'red.300', transform: 'scale(1.1)' }}
            transition="all 0.2s ease"
          />
        </Flex>
      </Flex>

      {/* ROUTES */}
      <Box flexGrow={1}>
        <Routes>
          <Route path="/" element={<HomeBase />} />
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
