import { Category } from './Category';

export interface Product {
  id: number,
  name: string,
  category: Category | null,
}
