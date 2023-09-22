import React, { useState, useEffect } from 'react';

const ProductCard = (props) => {
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
        className='card col-sm-2 m-3'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={boxStyle}
      >
        {props.image ? (
          <img src={props.image} className='card-img-top'></img>
        ) : (
          <img
            src={
              'https://images.ctfassets.net/kscjafx0jjrh/4zlnZcMpAM4r1SJNbPFE5Z/fc2c14951d7c590bd71aae7ab30db320/loop-isologo.svg'
            }
            className='card-img-top'
            style={{ height: '85px' }}
          ></img>
        )}
        <div className='card-body'>
          <h4 className='card-title text-center font-bold'>{props.title}</h4>
          <p className='card-text font-weight-bold'>
            <span style={{ 'font-weight': 'bold' }}>Price: </span>
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
