import { Category } from '../types/Category';

export const getCategoryById = (
  id: number,
  categories: Category[],
): Category | undefined => (
  categories.find(category => category.id === id)
);
