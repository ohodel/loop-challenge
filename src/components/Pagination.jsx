import React from 'react';

const Pagination = (props) => {
  const prevClass = props.page.previous === 'disabled' ? 'page-item disabled' : 'page-item';
  const nextClass = props.page.next === 'disabled' ? 'page-item disabled' : 'page-item';

  return (
    <nav aria-label='...'>
      <ul className='pagination justify-content-center'>
        <li className={prevClass}>
          <a
            className='page-link'
            onClick={props.changePage}
            style={{ cursor: 'pointer' }}
          >
            Previous
          </a>
        </li>
        <li className={nextClass}>
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
