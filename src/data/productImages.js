import product01 from '../assets/products/product-01.png';
import product02 from '../assets/products/product-02.png';
import product03 from '../assets/products/product-03.png';
import product04 from '../assets/products/product-04.png';

export const PRODUCT_IMAGES = [product01, product02, product03, product01, product04];

export function getProductImage(product, position = 0) {
  const seed = product?._id || product?.slug || product?.name || '';
  const offset = [...seed].reduce((total, character) => total + character.charCodeAt(0), position);
  return PRODUCT_IMAGES[offset % PRODUCT_IMAGES.length];
}