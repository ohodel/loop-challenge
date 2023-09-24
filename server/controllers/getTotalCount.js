const url = `https://universe-of-birds.myshopify.com//admin/api/2023-04/products/count.json`;
import fetchShopify from '../utils/shopify.js';

// Simple cache for count data here
let totalCount = 0;

export async function getTotalCount(req, res, next) {
  // If no cache, call the API
  // Could use Redis for this...
  if (totalCount === 0) {
    try {
      const totalCountParsed = await fetchShopify(url);
      totalCount = totalCountParsed.data.count;
      res.locals.totalCount = totalCount;
      return next();
    } catch (err) {
      console.log(err);
      return next({
        log: 'Error in getTotalCount' + err,
        status: 500,
        message: { err: 'Unable to complete request' },
      });
    }
  } else {
    res.locals.totalCount = totalCount;
    return next();
  }
}
