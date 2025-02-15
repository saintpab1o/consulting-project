// client/src/CartContext.js

import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(newItem) {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === newItem.id);
      if (existing) {
        return prev.map((p) =>
          p.id === newItem.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...newItem, quantity: 1 }];
      }
    });
  }

  function removeFromCart(itemId) {
    setCartItems((prev) => prev.filter((p) => p.id !== itemId));
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
