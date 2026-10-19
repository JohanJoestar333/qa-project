import { Product, ProductColor, ProductSize } from '../types';
import hoodieNavy from '../assets/images/hoodie-navy.jpg';
import hoodieOatmeal from '../assets/images/hoodie-oatmeal.jpg';
import hoodieBlack from '../assets/images/hoodie-black.jpg';
import sweatshirtCream from '../assets/images/sweatshirt-cream.jpg';
import sweatshirtGrey from '../assets/images/sweatshirt-grey.jpg';
import sweatshirtBlack from '../assets/images/sweatshirt-black.jpg';
import tshirtBlack from '../assets/images/tshirt-black.jpg';
import tshirtGrey from '../assets/images/tshirt-grey.jpg';
import tshirtOlive from '../assets/images/tshirt-olive.jpg';

const SIZES: ProductSize[] = [
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
];

// The first color in each list is the default shown in the catalog.
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PC-001',
    name: 'CloudSoft Everyday Hoodie',
    priceCents: 3999,
    formattedPrice: '$39.99',
    description: 'A comfortable everyday hoodie with a relaxed fit and soft fabric.',
    longDescription:
      'Cut from midweight brushed cotton fleece, the Everyday Hoodie is soft from the first wear. The hood is roomy and lined, the pouch pocket sits at a comfortable height, and the ribbed cuffs and hem keep everything in place. It layers easily over a tee and is just as good on its own.',
    details: [
      'Midweight brushed cotton fleece',
      'Relaxed fit',
      'Lined hood with flat drawcord',
      'Front pouch pocket',
      'Ribbed cuffs and hem',
    ],
    care: 'Machine wash cold with similar colors. Tumble dry low. Do not bleach.',
    stock: 50,
    tag: 'Best Seller',
    colors: [
      { id: 'navy', name: 'Navy', swatch: '#1f2a44', image: hoodieNavy },
      { id: 'oatmeal', name: 'Oatmeal', swatch: '#ddd5c4', image: hoodieOatmeal },
      { id: 'black', name: 'Black', swatch: '#1a1a1a', image: hoodieBlack },
    ],
    sizes: SIZES,
  },
  {
    id: 'PC-002',
    name: 'CloudSoft Classic Sweatshirt',
    priceCents: 3499,
    formattedPrice: '$34.99',
    description: 'A versatile crewneck sweatshirt designed for everyday comfort.',
    longDescription:
      'The Classic Sweatshirt is a crewneck made from soft cotton French terry, smooth on the outside and looped on the inside. The ribbed collar, cuffs and hem are cut to stay flat, and the straight body falls cleanly at the hip. A simple layer for most days of the year.',
    details: [
      'Cotton French terry',
      'Classic fit',
      'Ribbed crew collar',
      'Ribbed cuffs and hem',
      'Straight body',
    ],
    care: 'Machine wash cold with similar colors. Tumble dry low. Do not bleach.',
    stock: 50,
    tag: 'Classic Fit',
    colors: [
      { id: 'cream', name: 'Cream', swatch: '#ece4d1', image: sweatshirtCream },
      { id: 'grey', name: 'Heather Grey', swatch: '#a3a3a3', image: sweatshirtGrey },
      { id: 'black', name: 'Black', swatch: '#1a1a1a', image: sweatshirtBlack },
    ],
    sizes: SIZES,
  },
  {
    id: 'PC-003',
    name: 'CloudSoft Essential T-Shirt',
    priceCents: 1999,
    formattedPrice: '$19.99',
    description: 'A simple, lightweight cotton T-shirt suitable for everyday wear.',
    longDescription:
      'The Essential T-Shirt is made from lightweight cotton jersey that feels cool and breathable. The ribbed crew neck keeps its shape, and the hem is double stitched for a clean finish. Wear it on its own or as a base under anything else.',
    details: [
      'Lightweight cotton jersey',
      'Regular fit',
      'Ribbed crew neck',
      'Double-stitched hem',
    ],
    care: 'Machine wash cold with similar colors. Tumble dry low. Warm iron if needed.',
    stock: 50,
    tag: 'Pure Cotton',
    colors: [
      { id: 'black', name: 'Black', swatch: '#1a1a1a', image: tshirtBlack },
      { id: 'grey', name: 'Heather Grey', swatch: '#a3a3a3', image: tshirtGrey },
      { id: 'olive', name: 'Olive', swatch: '#6b7050', image: tshirtOlive },
    ],
    sizes: SIZES,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return INITIAL_PRODUCTS.find((p) => p.id === id);
};

// Falls back to the default color when the id is missing or unknown.
export const getProductColor = (product: Product, colorId?: string | null): ProductColor => {
  return product.colors.find((color) => color.id === colorId) ?? product.colors[0];
};

export const getProductSize = (product: Product, sizeId?: string | null): ProductSize | undefined => {
  return product.sizes.find((size) => size.id === sizeId);
};

// A cart line is one product in one color and size, for example "PC-001-navy-m".
export const getLineId = (productId: string, colorId: string, sizeId: string): string =>
  `${productId}-${colorId}-${sizeId}`;
