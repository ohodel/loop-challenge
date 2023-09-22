import React from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

const ProductsContainer = (props) => {
  // Map received product information to an array of product card components
  const productCards = [];

  for (let i = 0; i < props.productData.length; i++) {
    const currProduct = props.productData[i];

    // Handle when no image is sent
    if (currProduct.image) {
      productCards.push(
        <ProductCard
          title={currProduct.name}
          image={currProduct.image.src}
          total_orders={currProduct.total_orders}
          price={currProduct.price}
          total_value={currProduct.total_value}
          total_inventory={currProduct.total_inventory}
        />
      );
    } else {
      productCards.push(
        <ProductCard
          title={currProduct.name}
          total_orders={currProduct.total_orders}
          price={currProduct.price}
          total_value={currProduct.total_value}
          total_inventory={currProduct.total_inventory}
        />
      );
    }
  }

  return (
    <div className='w-95'>
      {/* If products have not been received yet, return the loading symbol */}
      {!productCards.length && !props.received ? (
        <div
          style={{ height: '150px' }}
          className='d-flex flex-column justify-content-center pb=5 align-items-center'
        >
          <div className='spinner-border text-primary' role='status'></div>
          <p className='text-primary'>Loading...</p>
        </div>
      ) : (
        <div className='flex justify-content-center'>
          <div className='row justify-content-center'>{productCards}</div>
          <Pagination changePage={props.changePage} />
        </div>
      )}
    </div>
  );
};

export default ProductsContainer;
