import { getUserById } from './getUserById';
import categoriesFromServer from '../api/categories';
import usersFromServer from '../api/users';

export const getPreparedCategories = () => categoriesFromServer
  .map(category => ({
    ...category,
    owner: getUserById(category.ownerId, usersFromServer),
  }));
