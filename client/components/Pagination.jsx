
const Pagination = (props) => {
  // Disable previous and next buttons
  const prevClass =
    props.page.previous === 'disabled' ? 'page-item disabled' : 'page-item';
  const nextClass =
    props.page.next === 'disabled' ? 'page-item disabled' : 'page-item';

  const totalPages = Math.ceil(props.totalCount / 15);

  // Create page number components
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    let className = 'page-item';
    // Activate only if the number equals the current page
    if (i === props.page.current) className = 'page-item active';
    pages.push(
      <li className={className}>
        <a
          className='page-link'
          onClick={props.changePage}
          style={{ cursor: 'pointer' }}
        >
          {i}
        </a>
      </li>
    );
  }

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
        {pages}
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
