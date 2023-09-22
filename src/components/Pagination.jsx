import React from 'react';

const Pagination = (props) => {
  return (
    <nav aria-label='...'>
      <ul className='pagination justify-content-center'>
        <li className='page-item'>
          <a
            className='page-link'
            onClick={props.changePage}
            style={{ cursor: 'pointer' }}
          >
            Previous
          </a>
        </li>
        <li className='page-item'>
          <a
            className='page-link'
            onClick={props.changePage}
            style={{ cursor: 'pointer' }}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
