export interface User {
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface Address {
  label: string;
  recipient: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentMethod {
  label: string;
  cardholder: string;
  displayedNumber: string;
  expiration: string;
}

export interface Product {
  id: 'PC-001' | 'PC-002' | 'PC-003';
  name: string;
  priceCents: number;
  formattedPrice: string;
  description: string;
  stock: number;
  category: string;
  image: string;
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
  image: string;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  address: Address;
  paymentMethod: PaymentMethod;
}

export interface CartSummary {
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  formattedSubtotal: string;
  formattedShipping: string;
  formattedTax: string;
  formattedTotal: string;
}
