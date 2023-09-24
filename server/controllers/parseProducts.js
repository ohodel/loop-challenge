export function parseProducts(req, res, next) {
  // Output object will ultimately be sent to the client
  const output = {
    total_count: res.locals.totalCount,
    products: [],
  };

  // Use the query parameters to determine which products to send back
  const page = req.query.page;
  // Scrub request if page is not a number
  if (+page) {
    const startIndex = (+page - 1) * 15;
    const endIndex = +page * 15;

    const currentProducts = res.locals.allProducts.slice(startIndex, endIndex);
    currentProducts.forEach((product) => {
      // Inventory id is used in getInventory
      res.locals.inventoryIdsString += product.inventory_item_id + ',';

      // Parse the order data to determine total value/orders of the product
      let total_value = 0;
      let total_orders = 0;
      for (let i = 0; i < res.locals.orders.length; i++) {
        // Line_items indicates the products in each order
        const lineItems = res.locals.orders[i].line_items;
        lineItems.forEach((item) => {
          if (item.variant_id === product.id) {
            // Increment total orders and value
            total_orders++;
            total_value = total_value + +product.price;
          }
        });
      }

      // Format price for USDollar
      let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      const current = {
        id: product.id,
        name: product.title,
        type: product.type,
        image: product.image,
        total_orders: total_orders,
        price: USDollar.format(product.price),
        total_value: USDollar.format(total_value),
        inventory_item_id: product.inventory_item_id,
        total_inventory: 0,
      };

      output.products.push(current);
    });

    res.locals.output = output;
    return next();
  } else {
    return next({
      log: 'Incorrect query parameter type',
      status: 400,
      message: { err: 'Incorrect parameters' },
    });
  }
}
