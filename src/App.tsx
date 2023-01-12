/* eslint-disable max-len */
import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { Category } from './types/Category';
import { Product } from './types/Product';

const getUserById = (id: number) => (
  usersFromServer.find(user => user.id === id) || null
);

const getCategoryById = (id: number, categories: Category[]) => (
  categories.find(category => category.id === id) || null
);

const preparedCategories: Category[] = categoriesFromServer.map(category => ({
  ...category,
  owner: getUserById(category.ownerId),
}));

const preparedProducts: Product[] = productsFromServer.map(product => ({
  ...product,
  category: getCategoryById(product.categoryId, preparedCategories),
}));

export const App: React.FC = () => {
  const [selectedOwnerId, setSelectedOwnerId] = useState(0);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedCategoriesId, setSelectedCategoriesId]
    = useState<number[]>([]);

  const filterProducts = (ownerId: number, nameFilterValue: string) => {
    let productsForShow = preparedProducts;

    productsForShow = (ownerId === 0)
      ? preparedProducts
      : preparedProducts
        .filter(product => product.category?.owner?.id === ownerId);

    productsForShow = productsForShow.filter((product) => {
      const normalizeProductName = product.name.toLowerCase();
      const normalizeNameFilterValue = nameFilterValue.toLowerCase();

      return normalizeProductName.includes(normalizeNameFilterValue);
    });

    return productsForShow;
  };

  const visibleProducts = filterProducts(selectedOwnerId, nameFilter);

  const handleResetAllClick = () => {
    setSelectedOwnerId(0);
    setNameFilter('');
    setSelectedCategoriesId([]);
  };

  const handleCategoryClick = (newId: number) => {
    if (!selectedCategoriesId.includes(newId)) {
      setSelectedCategoriesId(prev => ([
        ...prev,
        newId,
      ]));
    } else {
      setSelectedCategoriesId(prev => {
        return prev.filter(id => id !== newId);
      });
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedOwnerId(0)}
                className={cn({
                  'is-active': selectedOwnerId === 0,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedOwnerId(user.id)}
                  className={cn({
                    'is-active': selectedOwnerId === user.id,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={nameFilter}
                  onChange={(event) => setNameFilter(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {nameFilter && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setNameFilter('')}
                    />
                  </span>
                )}

              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {preparedCategories.map(({ id, title }) => (
                <a
                  key={id}
                  data-cy="Category"
                  className={cn(
                    'button',
                    'mr-2',
                    'my-1',
                    {
                      'is-info': selectedCategoriesId.includes(id),
                    },
                  )}
                  href="#/"
                  onClick={() => handleCategoryClick(id)}
                >
                  {title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllClick}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map(({ id, name, category }) => (
                    <tr key={id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">{`${category?.icon} - ${category?.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': category?.owner?.sex === 'm',
                          'has-text-danger': category?.owner?.sex === 'f',
                        })}
                      >
                        {category?.owner?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
