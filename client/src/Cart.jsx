// client/src/Cart.jsx

import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_sMhaRpfdu5ycIoFm0mBrEmcW');

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const total = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  useEffect(() => {
    if (cartItems.length === 0) {
      setClientSecret('');
      setErrorMsg('');
      return;
    }
    createPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  async function createPaymentIntent() {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems })
      });
      const data = await res.json();
      setLoading(false);

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setErrorMsg(data.error || 'Could not create PaymentIntent. Check logs.');
      }
    } catch (err) {
      console.error('Error creating PaymentIntent:', err);
      setErrorMsg('Server error creating PaymentIntent.');
      setLoading(false);
    }
  }

  return (
    <Box
      w="full"
      minH="100vh"
      bg="black"
      color="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      pt={8}
      px={4}
    >
      <Heading mb={6}>Your Cart</Heading>

      {cartItems.length === 0 ? (
        <Text color="gray.300">Your cart is empty.</Text>
      ) : (
        <Box
          w={{ base: 'full', md: '600px' }}
          bg="rgba(0, 0, 0, 0.7)"
          p={4}
          borderRadius="md"
        >
          <VStack spacing={4} align="stretch">
            {cartItems.map((item) => (
              <Flex
                key={item.id}
                justify="space-between"
                align="center"
                bg="gray.800"
                p={4}
                borderRadius="md"
              >
                <Box>
                  <Text fontWeight="bold" color="red.300">
                    {item.name}
                  </Text>
                  <Text color="gray.200">
                    Price: ${item.price} | Qty: {item.quantity || 1}
                  </Text>
                </Box>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </Flex>
            ))}
          </VStack>

          <Heading size="md" mt={4}>
            Total: ${total}
          </Heading>

          {loading && <Text color="gray.300" mt={4}>Creating payment intent...</Text>}
          {errorMsg && <Text color="red.300" mt={4}>{errorMsg}</Text>}

          {!loading && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm cartItems={cartItems} total={total} />
            </Elements>
          )}
        </Box>
      )}
    </Box>
  );
}

/**
 * PaymentForm 
 * - single form for name, email, phone, plus PaymentElement
 * - after payment success => call /complete-order
 */
function PaymentForm({ cartItems, total }) {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [payError, setPayError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPayError('');
    setSuccessMsg('');
    setIsProcessing(true);

    try {
      // 1) Confirm Payment w/ Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: formData.email,
          payment_method_data: {
            billing_details: {
              name: formData.name,
              phone: formData.phone
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment error:', error);
        setPayError(error.message || 'Payment failed. Try again.');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 2) Payment success => call /complete-order to send emails
        const orderResponse = await fetch('http://localhost:5000/complete-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            cartItems,
            total
          })
        });
        const orderData = await orderResponse.json();
        setIsProcessing(false);

        if (orderResponse.ok) {
          setSuccessMsg('Payment successful! ' + orderData.message);
        } else {
          // Payment succeeded, but email might fail => show partial error
          setSuccessMsg('Payment successful! However, email sending failed: ' + (orderData.error || 'Unknown'));
        }
      } else {
        setPayError('Payment was not completed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Error confirming payment or sending emails:', err);
      setPayError('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg="gray.800" p={4} borderRadius="md" mt={6}>
      <FormControl mb={4}>
        <FormLabel color="gray.300">Name</FormLabel>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          bg="gray.700"
          borderColor="gray.600"
          color="white"
          required
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel color="gray.300">Email</FormLabel>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          bg="gray.700"
          borderColor="gray.600"
          color="white"
          required
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel color="gray.300">Phone</FormLabel>
        <Input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          bg="gray.700"
          borderColor="gray.600"
          color="white"
        />
      </FormControl>

      <Text color="gray.200" mb={2}>Card Details:</Text>
      <PaymentElement id="payment-element" style={{ base: { color: '#ffffff' } }} />

      {payError && (
        <Text color="red.300" mt={3} fontWeight="bold">
          {payError}
        </Text>
      )}
      {successMsg && (
        <Text color="green.300" mt={3} fontWeight="bold">
          {successMsg}
        </Text>
      )}

      <Button
        type="submit"
        colorScheme="green"
        w="full"
        mt={4}
        isLoading={isProcessing}
        loadingText="Processing..."
        isDisabled={!stripe || !elements}
      >
        Submit Payment
      </Button>
    </Box>
  );
}

export default Cart;
