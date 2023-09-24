import fetchShopify from '../utils/shopify.js';
import { product_url } from './constants.js';

export async function getProducts(req, res, next) {
  try {
    let products = [];
    let url = product_url;
    while (url) {
      const totalProducts = await fetchShopify(url);

      // Add only variants to product list
      totalProducts.data.products.forEach((product) => {
        // Store the default name
        const default_name = product.title;
        product.variants.forEach((variant) => {
          // Type handles options
          // See here for more details: https://shopify.dev/docs/api/admin-rest/2023-07/resources/product-variant
          const type = variant.title === 'Default Title' ? null : variant.title;
          variant.title = default_name;
          variant.type = type;
          variant.image = product.image;
        });
        products = products.concat(product.variants);
      });

      // Update the url to the provided next
      url = totalProducts.links.next ? totalProducts.links.next.url : null;
    }
    res.locals.allProducts = products;
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: 'Error in getProducts' + err,
      status: 500,
      message: { err: 'Unable to complete request' },
    });
  }
}
