import { useState, useEffect } from 'react';
import ProductsContainer from './components/ProductsContainer';

function App() {
  const [products, setProducts] = useState([]);
  const [received, setReceived] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState({
    current: 1,
    previous: 'disabled',
    next: 'active',
  });

  const getProducts = async (page) => {
    try {
      const productsRaw = await fetch(`/products?page=${page}`);
      const productsParsed = await productsRaw.json();

      setProducts(productsParsed.products);
      setTotalCount(productsParsed.total_count);
      setReceived(true);
    } catch (err) {
      console.log(err);
    }
  };

  const changePage = (e) => {
    e.preventDefault();
    const target = e.target;
    let targetText = target.innerText;

    let newPage;
    if (targetText === 'Next') newPage = page.current + 1;
    else if (targetText === 'Previous') newPage = page.current - 1;
    else newPage = +targetText;
    setPage({
      current: newPage,
      previous: newPage <= 1 ? 'disabled' : 'active',
      next: newPage < Math.ceil(totalCount / 15) ? 'active' : 'disabled',
    });

    // Reset product state to render the loading symbol
    setReceived(false);
    setProducts([]);

    getProducts(newPage);

    // Scroll to top of page
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getProducts(1);
  }, []);

  return (
    <div className='h-100 d-flex flex-column align-items-center'>
      <h1
        className='h1 display-3 pt-5 pb-1'
        style={{ color: '#2b33ff', fontWeight: 'bold' }}
      >
        Universe of Birds
      </h1>
      <h3 className='h3 pb-5 text-muted'>Product Details</h3>
      <ProductsContainer
        productData={products}
        received={received}
        totalCount={totalCount}
        getProducts={getProducts}
        changePage={changePage}
        page={page}
      />
    </div>
  );
}

export default App;
