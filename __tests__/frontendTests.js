import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProductCard from '../src/components/ProductCard.jsx';
import ProductsContainer from '../src/components/ProductsContainer.jsx';
import Pagination from '../src/components/Pagination.jsx';

describe('React Component Tests', () => {
  describe('Product Card', () => {
    let productCard;

    const props = {
      title: 'Test',
      image: 'TestURL',
      total_orders: 10,
      price: '$1',
      total_value: '$100.00',
      total_inventory: 50,
    };

    beforeEach(() => {
      productCard = render(<ProductCard {...props} />);
    });

    it('Renders the correct image', () => {
      const image = screen.getByRole('img');
      expect(image.src).toContain('TestURL');
    });

    it('Renders the correct product details', () => {
      const heading = screen.getByRole('heading');
      expect(heading).toHaveTextContent('Test');
    });
  });

  describe('Products Container', () => {
    let productsContainer;

    it('Renders the correct product cards', () => {
      const props = {
        productData: [
          {
            id: 1,
            image: 'TestURL',
            inventory_item_id: 12,
            name: 'Test',
            price: '$1.00',
            total_inventory: 50,
            total_orders: 10,
            total_value: '$100.00',
          },
        ],
        received: true,
      };
      productsContainer = render(<ProductsContainer {...props} />);
      const card = screen.getByText('Test');
      expect(card).toBeInTheDocument();
    });

    it('Renders the loading symbol', () => {
      const props = {
        productData: [],
        received: false,
      };
      productsContainer = render(<ProductsContainer {...props} />);
      const loading = screen.getByText('Loading...');
      expect(loading).toBeInTheDocument();
    });
  });

  describe('Pagination Component', () => {
    let pagination;

    const props = {
      changePage: jest.fn(),
    };

    beforeEach(() => {
      pagination = render(<Pagination {...props} />);
    });

    it('Renders page change links', () => {
      const list = screen.getAllByRole('list');
      console.log(list);
      const previous = within(list[0]).getByText('Previous');
      expect(previous).toBeTruthy();

      const next = within(list[0]).getByText('Next');
      expect(next).toBeTruthy();
    });
  });
});
