/* eslint-disable max-len */
import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import usersFromServer from './api/users';
import { getPreparedProducts } from './helpers/getPreparedProducts';
import { getPreparedCategories } from './helpers/getPreparedCategories';
import { ProductsList } from './components/ProductsList';

export const App: React.FC = () => {
  const [products] = useState(getPreparedProducts);
  const [categories] = useState(getPreparedCategories);
  const [selectedOwnerId, setSelectedOwnerId] = useState(0);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedCategoriesId, setSelectedCategoriesId]
    = useState<number[]>([]);

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

  const getFilteredProducts = () => {
    return products.filter(product => {
      const ownerId = product.category?.owner?.id;
      const normalizeProductName = product.name.toLowerCase();

      const isSelectedOwnerIdMatch = (selectedOwnerId !== 0)
        ? (ownerId === selectedOwnerId)
        : true;

      const isNameFilterMatch = normalizeProductName.includes(nameFilter.toLowerCase());

      const isSelectedCategoriesMatch = (selectedCategoriesId.length !== 0)
        ? selectedCategoriesId.includes(product.categoryId)
        : true;

      return isSelectedOwnerIdMatch && isNameFilterMatch && isSelectedCategoriesMatch;
    });
  };

  const visibleProducts = getFilteredProducts();

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
                className={cn(
                  'button',
                  'is-success',
                  'mr-6',
                  { 'is-outlined': selectedCategoriesId.length },
                )}
                onClick={() => setSelectedCategoriesId([])}
              >
                All
              </a>

              {categories.map(({ id, title }) => (
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

        <ProductsList visibleProducts={visibleProducts} />
      </div>
    </div>
  );
};
