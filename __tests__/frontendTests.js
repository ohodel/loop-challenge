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
      type: 'Small',
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
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('Test');
      expect(headings[1]).toHaveTextContent('Small');
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
        page: { current: 1, previous: 'disabled', next: 'active' },
        totalCount: 100,
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
      page: { current: 1, previous: 'disabled', next: 'active' },
      totalCount: 100,
    };

    beforeEach(() => {
      pagination = render(<Pagination {...props} />);
    });

    it('Renders page change links', () => {
      const list = screen.getAllByRole('list');
      const previous = within(list[0]).getByText('Previous');
      expect(previous).toBeTruthy();

      const next = within(list[0]).getByText('Next');
      expect(next).toBeTruthy();
    });

    it('Renders correct number of pages', () => {
      const list = screen.getByRole('list');
      const { getAllByRole } = within(list);
      const items = getAllByRole("listitem")
      expect(items).toHaveLength(9);
    });
  });
});
