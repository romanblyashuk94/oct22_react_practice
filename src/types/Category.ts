import { User } from './User';

export interface Category {
  id: number,
  title: string,
  icon: string,
  owner?: User
}
