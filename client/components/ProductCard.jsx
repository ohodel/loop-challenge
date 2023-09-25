import React, { useState } from 'react';

const ProductCard = (props) => {
  // Use state to change product card border on hover
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };
  const boxStyle = {
    border: hover ? '3px solid #3b82f680' : null,
  };

  return (
    <>
      <div
        className='card col-md-4 col-lg-2 m-3 p-0'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={boxStyle}
      >
        {/* If no image, use Loop logo */}
        {props.image ? (
          <img
            src={props.image}
            className='card-img-top '
            style={{ height: '35%', objectFit: 'cover' }}
          ></img>
        ) : (
          <img
            src={
              'https://images.ctfassets.net/kscjafx0jjrh/4zlnZcMpAM4r1SJNbPFE5Z/fc2c14951d7c590bd71aae7ab30db320/loop-isologo.svg'
            }
            className='card-img-top'
            style={{ height: '35%' }}
          ></img>
        )}
        <div className='card-body'>
          <h4 className='card-title text-center font-weight-bold'>
            {props.title}
          </h4>
          <h6 className='card-title text-center text-muted'>
            <em>{props.type}</em>
          </h6>
          <p className='card-text font-weight-bold'>
            <span style={{ fontWeight: 'bold' }}>Price: </span>
            {props.price ? props.price : '$0.00'}
          </p>
          <p className='card-text'>
            <span style={{ fontWeight: 'bold' }}>Total Orders: </span>
            {props.total_orders ? props.total_orders : 0}
          </p>
          <p className='card-text'>
            <span style={{ fontWeight: 'bold' }}>Current Stock: </span>
            {props.total_inventory ? props.total_inventory : 0}
          </p>
          <p className='card-text'>
            <span style={{ fontWeight: 'bold' }}>Total Value: </span>
            {props.total_value ? props.total_value : '$0.00'}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
