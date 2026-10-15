import { Product } from '../types';
import hoodieImage from '../assets/images/hoodie.jpg';
import sweatshirtImage from '../assets/images/sweatshirt.jpg';
import tshirtImage from '../assets/images/tshirt.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PC-001',
    name: 'CloudSoft Everyday Hoodie',
    priceCents: 3999,
    formattedPrice: '$39.99',
    description: 'A comfortable everyday hoodie with a relaxed fit and soft fabric.',
    stock: 50,
    image: hoodieImage,
    tag: 'Best Seller',
  },
  {
    id: 'PC-002',
    name: 'CloudSoft Classic Sweatshirt',
    priceCents: 3499,
    formattedPrice: '$34.99',
    description: 'A versatile crewneck sweatshirt designed for everyday comfort.',
    stock: 50,
    image: sweatshirtImage,
    tag: 'Classic Fit',
  },
  {
    id: 'PC-003',
    name: 'CloudSoft Essential T-Shirt',
    priceCents: 1999,
    formattedPrice: '$19.99',
    description: 'A simple, lightweight cotton T-shirt suitable for everyday wear.',
    stock: 50,
    image: tshirtImage,
    tag: 'Pure Cotton',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return INITIAL_PRODUCTS.find((p) => p.id === id);
};
