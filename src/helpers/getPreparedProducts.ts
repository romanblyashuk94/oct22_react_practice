/* eslint-disable max-len */
import { getPreparedCategories } from './getPreparedCategories';
import { getCategoryById } from './getCategoryById';
import productsFromServer from '../api/products';
import { Product } from '../types/Product';

export const getPreparedProducts = (): Product[] => productsFromServer.map(product => ({
  ...product,
  category: getCategoryById(product.categoryId, getPreparedCategories()),
}));
