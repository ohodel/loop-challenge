const url = `https://universe-of-birds.myshopify.com/admin/api/2023-04/inventory_levels.json?inventory_item_ids=`;
import fetchShopify from '../utils/shopify.js';

export async function getInventory(req, res, next) {
  try {
    const inventory = await fetchShopify(url + res.locals.inventoryIdsString);

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
