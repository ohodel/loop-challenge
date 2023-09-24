import fetchShopify from '../utils/shopify.js';
import { inventory_url } from './constants.js';

export async function getInventory(req, res, next) {
  try {
    const inventory = await fetchShopify(
      inventory_url + res.locals.inventoryIdsString
    );

    // Add the associated inventory level to each item in output
    res.locals.output.products.forEach((product) => {
      inventory.data.inventory_levels.forEach((inventory) => {
        if (inventory.inventory_item_id === product.inventory_item_id)
          product.total_inventory += inventory.available;
      });
    });

    return next();
  } catch (err) {
    return next({
      log: 'Error in retrieving inventory' + err,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }
}
