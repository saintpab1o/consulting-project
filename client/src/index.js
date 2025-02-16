// client/src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import AppWrapper from './App';
import { CartProvider } from './CartContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </ChakraProvider>
  </React.StrictMode>
);
