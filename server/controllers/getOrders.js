import fetchShopify from '../utils/shopify.js';
import { order_url } from './constants.js';

// Cache for order data stored here
// Could use something like Redis for this...
let orders = [];

export async function getOrders(req, res, next) {
  // If no cache, call the API
  if (!orders.length) {
    try {
      let url = order_url;
      while (url) {
        const totalOrders = await fetchShopify(url);

        // Add orders to orders array
        orders = orders.concat(totalOrders.data.orders);

        // Reassign url to the provided next property
        url = totalOrders.links.next ? totalOrders.links.next.url : null;
      }
      res.locals.orders = orders;
      return next();
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
