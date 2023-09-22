import { useState, useEffect } from 'react';
import './App.css';
import ProductsContainer from './components/ProductsContainer';

function App() {
  const [products, setProducts] = useState([]);
  const [received, setReceived] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const getProducts = async (page) => {
    console.log('PAGE', page);
    try {
      const productsRaw = await fetch(`/products?page=${page}`, {
        // headers: { request_type },
      });
      const productsParsed = await productsRaw.json();

      console.log('PRODUCTS RECEIVED', productsParsed);

      setProducts(productsParsed.products);
      setTotalCount(productsParsed.total_count);
      setReceived(true);
    } catch (err) {
      console.log(err);
    }
  };

  const changePage = (e) => {
    e.preventDefault();
    console.log('CLICKED');
    const target = e.target;
    let targetText = target.innerText;

    let newPage;
    if (targetText === 'Next') newPage = page + 1;
    else newPage = page - 1;
    setPage(newPage);

    // Reset product state to change UI to loading symbol
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
      <p
        className='h1 display-2 pt-5 pb-5'
        style={{ color: '#2b33ff', fontWeight: 'bold' }}
      >
        Universe of Birds
      </p>
      <ProductsContainer
        productData={products}
        received={received}
        totalCount={totalCount}
        getProducts={getProducts}
        changePage={changePage}
      />
    </div>
  );
}

export default App;
