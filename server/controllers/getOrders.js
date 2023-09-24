import fetchShopify from '../utils/shopify.js';
import { order_url } from './constants.js';

// Simple cache for order data here
let orders = [];

export async function getOrders(req, res, next) {
  // If no cache, call the API
  // Could use Redis for this...
  if (!orders.length) {
    try {
      let url = order_url;
      while (url) {
        const totalOrders = await fetchShopify(url);

        // Add orders to orders array
        orders = orders.concat(totalOrders.data.orders);

        url = totalOrders.links.next ? totalOrders.links.next.url : null;
      }
      res.locals.orders = orders;
      return next();
    } catch (err) {
      console.log(err);
      return next({
        log: 'Error in getOrders' + err,
        status: 500,
        message: { err: 'Unable to complete request' },
      });
    }
  } else {
    res.locals.orders = orders;
    return next();
  }
}
