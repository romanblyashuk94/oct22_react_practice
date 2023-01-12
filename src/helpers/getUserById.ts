import { User } from '../types/User';

export const getUserById = (id: number, users: User[]): User | undefined => (
  users.find(user => user.id === id)
);
