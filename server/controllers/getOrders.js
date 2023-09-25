import fetchShopify from '../utils/shopify.js';
import { order_url } from './constants.js';

// Simple cache
// Could use something like Redis for this...
let orders = [];

export async function getOrders(req, res, next) {
  // If no cache, call the API
  if (!orders.length) {
    try {
      let url = order_url;
      while (url) {
        const totalOrders = await fetchShopify(url);

        // Store all order data in cache (aggregation done in parseProducts)
        // In future, can modify to just store necessary info
        orders = orders.concat(totalOrders.data.orders);

        // Reassign url to the provided next property
        url = totalOrders.links.next ? totalOrders.links.next.url : null;
      }
    } catch (err) {
      return next({
        log: 'Error in getOrders' + err,
        status: 500,
        message: { err: 'Unable to complete request' },
      });
    }
  }

  res.locals.orders = orders;
  return next();
}
