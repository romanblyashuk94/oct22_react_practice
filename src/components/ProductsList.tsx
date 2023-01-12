/* eslint-disable max-len */

import { FC, useState } from 'react';
import cn from 'classnames';

import { Product } from '../types/Product';
import { SortType } from '../types/SortTypes';

type Props = {
  visibleProducts: Product[]
};

export const ProductsList: FC<Props> = ({ visibleProducts }) => {
  const [sortType, setSortType] = useState(SortType.NONE);
  const [isReversed, setIsReversed] = useState(false);
  const [sortClickNum, setSortClickNum] = useState(0);

  const handleSortClick = (newSortType: SortType) => {
    if (sortType !== newSortType) {
      setSortType(newSortType);
      setIsReversed(false);
      setSortClickNum(1);
    } else if (sortClickNum === 1) {
      setIsReversed(true);
      setSortClickNum(2);
    } else {
      setSortType(SortType.NONE);
      setIsReversed(false);
      setSortClickNum(0);
    }
  };

  const getSortedProducts = () => {
    const sortedProducts = [...visibleProducts];

    switch (sortType) {
      case SortType.ID:
        sortedProducts.sort((a, b) => a.id - b.id);
        break;

      case SortType.PRODUCT:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortType.CATEGORY:
        sortedProducts.sort((a, b) => {
          if (a.category && b.category) {
            return a.category.title.localeCompare(b.category.title);
          }

          return 0;
        });
        break;

      case SortType.USER:
        sortedProducts.sort((a, b) => {
          if (a?.category?.owner && b?.category?.owner) {
            return a.category.owner.name.localeCompare(b.category.owner.name);
          }

          return 0;
        });
        break;

      default:
        break;
    }

    if (isReversed) {
      sortedProducts.reverse();
    }

    return sortedProducts;
  };

  const productsForShow = getSortedProducts();

  return (
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

                    <a
                      href="#/"
                      onClick={() => handleSortClick(SortType.ID)}
                    >
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={cn(
                            'fas',
                            { 'fa-sort': sortType !== SortType.ID },
                            { 'fa-sort-up': sortType === SortType.ID && sortClickNum === 1 },
                            { 'fa-sort-down': sortType === SortType.ID && sortClickNum === 2 },

                          )}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a
                      href="#/"
                      onClick={() => handleSortClick(SortType.PRODUCT)}
                    >
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={cn(
                            'fas',
                            { 'fa-sort': sortType !== SortType.PRODUCT },
                            { 'fa-sort-up': sortType === SortType.PRODUCT && sortClickNum === 1 },
                            { 'fa-sort-down': sortType === SortType.PRODUCT && sortClickNum === 2 },

                          )}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a
                      href="#/"
                      onClick={() => handleSortClick(SortType.CATEGORY)}
                    >
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={cn(
                            'fas',
                            { 'fa-sort': sortType !== SortType.CATEGORY },
                            { 'fa-sort-up': sortType === SortType.CATEGORY && sortClickNum === 1 },
                            { 'fa-sort-down': sortType === SortType.CATEGORY && sortClickNum === 2 },

                          )}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/" onClick={() => handleSortClick(SortType.USER)}>
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={cn(
                            'fas',
                            { 'fa-sort': sortType !== SortType.USER },
                            { 'fa-sort-up': sortType === SortType.USER && sortClickNum === 1 },
                            { 'fa-sort-down': sortType === SortType.USER && sortClickNum === 2 },

                          )}
                        />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {productsForShow.map(({ id, name, category }) => (
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
  );
};
