import fetchShopify from '../utils/shopify.js';
import { count_url } from './constants.js';

// Cache for count data stored here
// Could use something like Redis for this...
let totalCount = 0;

export async function getTotalCount(req, res, next) {
  // If no cache, call the API
  if (totalCount === 0) {
    try {
      const totalCountParsed = await fetchShopify(count_url);
      totalCount = totalCountParsed.data.count;
    } catch (err) {
      return next({
        log: 'Error in getTotalCount' + err,
        status: 500,
        message: { err: 'Unable to complete request' },
      });
    }
  }

  res.locals.totalCount = totalCount;
  return next();
}
