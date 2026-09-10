/**
 * Centralized Test Fixtures & Data for BugMart Automation Suite
 */

export const TEST_USER = {
  name: 'Alex Morgan',
  firstName: 'Alex',
  email: 'tester@example.com',
  password: 'Test@123',
};

export const INVALID_USER = {
  email: 'tester@example.com',
  password: 'WrongPassword999!',
};

export const SEARCH_DATA = {
  query: 'Headphones',
  expectedProductName: 'AeroBeat Pro Wireless Headphones',
};

export const FILTER_DATA = {
  category: 'Wearables',
  expectedProduct: 'Titan Pulse Smart Fitness Watch',
  excludedProduct: 'AeroBeat Pro Wireless Headphones', // From Electronics
};

export const CHECKOUT_DATA = {
  name: 'Alex Morgan',
  email: 'tester@example.com',
  phone: '9876543210',
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'Oregon',
  pinCode: '97477',
  cardNumber: '4111 2222 3333 4444',
  cardExpiry: '12/28',
  cardCvv: '789',
};
