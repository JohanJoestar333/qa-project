import { Address, PaymentMethod, User } from '../types';

export const PRECONFIGURED_USER: User & { password: string } = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  password: 'Test123!',
  status: 'Active',
};

export const SAVED_DELIVERY_ADDRESS: Address = {
  label: 'Home',
  recipient: 'Alex Morgan',
  street: '123 QA Testing Lane',
  city: 'Austin',
  state: 'Texas',
  zip: '78701',
  country: 'United States',
};

export const SAVED_PAYMENT_METHOD: PaymentMethod = {
  label: 'Personal Visa',
  cardholder: 'Alex Morgan',
  displayedNumber: '•••• •••• •••• 4242',
  expiration: '12/28',
};
