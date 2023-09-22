import express from 'express';
import parseLinkHeader from 'parse-link-header';
const app = express();

const PORT = 3000;

// Body parser
app.use(express.json());

/* Local Storage */

// Store all order data
let orders = [];
const getOrders = async () => {
  try {
    let orderUrl =
      'https://universe-of-birds.myshopify.com/admin/api/2020-04/orders.json';
    while (orderUrl) {
      const totalOrdersRaw = await fetch(orderUrl, {
        headers: {
          Authorization:
            'Basic ' +
            btoa(
              'ce1a505e76f9fa5609b1580c9efc04a9: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'
            ),
        },
      });

      const totalOrdersParsed = await totalOrdersRaw.json();
      orders = orders.concat(totalOrdersParsed.orders);

      let orderHeaders = totalOrdersRaw.headers.get('Link');
      const parsedLinks = parseLinkHeader(orderHeaders);

      orderUrl = parsedLinks.next ? parsedLinks.next.url : null;
    }
  } catch (err) {
    console.log(err);
  }
};

getOrders();

// Retrieve total product count
let totalCount = 0;
const getTotalCount = async () => {
  try {
    const totalCountRaw = await fetch(
      `https://universe-of-birds.myshopify.com//admin/api/2023-04/products/count.json`,
      {
        headers: {
          Authorization:
            'Basic ' +
            btoa(
              'ce1a505e76f9fa5609b1580c9efc04a9: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'
            ),
        },
      }
    );

    const totalCountParsed = await totalCountRaw.json();
    totalCount = totalCountParsed.count;
  } catch (err) {
    console.log(err);
  }
};

getTotalCount();

// Get all products

const getProducts = async () => {
  try {
    let products = [];
    let productUrl =
      'https://universe-of-birds.myshopify.com/admin/api/2020-04/products.json?fields=id,image,title,variants';
    while (productUrl) {
      const totalProductsRaw = await fetch(productUrl, {
        headers: {
          Authorization:
            'Basic ' +
            btoa(
              'ce1a505e76f9fa5609b1580c9efc04a9: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'
            ),
        },
      });

      const totalProductsParsed = await totalProductsRaw.json();

      // Add only varients to product list
      totalProductsParsed.products.forEach((product) => {
        // Store the default name
        const default_name = product.title;
        product.variants.forEach((variant) => {
          const name =
            variant.title === 'Default Title' ? default_name : variant.title;
          variant.title = name;
          variant.image = product.image;
        });
        products = products.concat(product.variants);
      });

      let productHeaders = totalProductsRaw.headers.get('Link');
      const parsedLinks = parseLinkHeader(productHeaders);

      if (parsedLinks) {
        productUrl = parsedLinks.next ? parsedLinks.next.url : null;
      }
    }
    return products;
  } catch (err) {
    console.log(err);
  }
};

/* Routes */

// Handle products request
app.get('/products', async (req, res, next) => {
  const output = {
    total_count: totalCount,
    products: [],
  };

  // Query just relevant product inventory with a comma separated string
  let inventoryIdsString = '';

  // Use the query parameters to get a list of the products to send back
  const page = req.query.page;
  const startIndex = (page - 1) * 15;
  const endIndex = page * 15;
  const products = await getProducts();
  const currentProducts = products.slice(startIndex, endIndex);

  // Populate output variable with additional info about each product
  currentProducts.forEach((product) => {
    // Add inventory id to query string (handled later on)
    inventoryIdsString += product.inventory_item_id + ',';

    // Parse the order data to determine total value/orders of the product
    let total_value = 0;
    let total_orders = 0;
    for (let i = 0; i < orders.length; i++) {
      // Line_items indicates the products in each order
      const lineItems = orders[i].line_items;
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
      image: product.image,
      total_orders: total_orders,
      price: USDollar.format(product.price),
      total_value: USDollar.format(total_value),
      inventory_item_id: product.inventory_item_id,
      total_inventory: 0,
    };

    output.products.push(current);
  });

  // Retrieve a list of each product's current inventory
  try {
    const inventoryRaw = await fetch(
      `https://universe-of-birds.myshopify.com/admin/api/2023-04/inventory_levels.json?inventory_item_ids=${inventoryIdsString}`,
      {
        headers: {
          Authorization:
            'Basic ' +
            btoa(
              'ce1a505e76f9fa5609b1580c9efc04a9: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'
            ),
        },
      }
    );

    const inventoryParsed = await inventoryRaw.json();

    // Add the associated inventory level to each item in output
    output.products.forEach((product) => {
      inventoryParsed.inventory_levels.forEach((inventory) => {
        if (inventory.inventory_item_id === product.inventory_item_id)
          product.total_inventory += inventory.available;
      });
    });
  } catch (err) {
    return next({
      log: 'Error in retrieving inventory' + err,
      status: 500,
      message: { err: 'An error occurred' },
    });
  }

  // If successful, send output object
  res.status(200).send(output);
});

// Handle endopoint does not exist
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;
