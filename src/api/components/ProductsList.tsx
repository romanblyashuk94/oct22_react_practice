/* eslint-disable max-len */
import { FC, useState } from 'react';
import cn from 'classnames';

import { Product } from '../../types/Product';
import { SortType } from '../../types/SortTypes';

type Props = {
  visibleProducts: Product[]
};

export const ProductsList: FC<Props> = ({ visibleProducts }) => {
  const [sortType, setSortType] = useState(SortType.NONE);
  const [isReversed, setIsReversed] = useState(false);

  const handleIdHeaderClick = () => {
    if (sortType !== SortType.ID && !isReversed) {
      setSortType(SortType.ID);
    } else if (sortType === SortType.ID && !isReversed) {
      setIsReversed(true);
    } else {
      setSortType(SortType.NONE);
      setIsReversed(false);
    }
  };

  const getSortedProducts = () => {
    const sortedProducts = [...visibleProducts];

    switch (sortType) {
      case SortType.ID:
        sortedProducts.sort((a, b) => a.id - b.id);
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
                      onClick={() => handleIdHeaderClick()}
                    >
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={cn(
                            'fas',
                            { 'fa-sort': sortType !== SortType.ID && !isReversed },
                            { 'fa-sort-up': sortType === SortType.ID && !isReversed },
                            { 'fa-sort-down': sortType === SortType.ID && isReversed },

                          )}
                        />
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
