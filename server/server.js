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
};

getOrders();

// Retrieve total product count
let totalCount = 0;
const getTotalCount = async () => {
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
};

getTotalCount();

// Get all products

const getProducts = async () => {
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
};

// getProducts();

// Store next and previous
const pagination = {
  next: {
    url: `https://universe-of-birds.myshopify.com/admin/api/2020-04/products.json?fields=id,image,title,variants,status&status=active`,
  },
  prev: null,
};

/* Routes */

// Handle products request
app.get('/products', async (req, res, next) => {
  const output = {
    total_count: totalCount,
    products: [],
  };
  let inventoryIdsString = '';

  let productsUrl = pagination.next.url;

  if (req.headers.request_type === 'prev') productsUrl = pagination.prev.url;

  // Retrieve the first 20 products
  // const productsRaw = await fetch(productsUrl, {
  //   headers: {
  //     Authorization:
  //       'Basic ' +
  //       btoa(
  //         'ce1a505e76f9fa5609b1580c9efc04a9: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'
  //       ),
  //   },
  // });

  // let productHeaders = productsRaw.headers.get('Link');
  // const parsedLinks = parseLinkHeader(productHeaders);
  // console.log('PARSEDLINKES', parsedLinks);
  // pagination.next = parsedLinks.next;
  // pagination.prev = parsedLinks.previous;

  // console.log('PAGINATION OBJ', pagination);

  // const products = await productsRaw.json();

  // TRYING THIS OUT!!
  const products = await getProducts();
  console.log(products);

  // Get products from storage
  const page = req.query.page;

  const startIndex = (page - 1) * 15;
  const endIndex = page * 15;

  const currentProducts = products.slice(startIndex, endIndex);

  console.log('length', currentProducts.length);

  // Add each product to the output
  // products.products.forEach(async (product) => {
  currentProducts.forEach(async (product) => {
    // Add the id to productIds
    inventoryIdsString += product.inventory_item_id + ',';

    // Format price for USDollar
    let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    let total_value = 0;

    const current = {
      id: product.id,
      name: product.title,
      image: product.image,
      total_orders: 0,
      price: USDollar.format(product.price),
      total_value: USDollar.format(total_value),
      inventory_item_id: product.inventory_item_id,
      total_inventory: 0,
    };

    // Loop through each order
    for (let i = 0; i < orders.length; i++) {
      const lineItems = orders[i].line_items;
      // Loop through each line item
      lineItems.forEach((item) => {
        // If the id matches
        if (item.product_id === current.id) {
          console.log('FOUND');
          // Increment total orders and value
          current.total_orders++;
          total_value += current.price;
        }
      });
    }

    output.products.push(current);
  });

  // Retrieve a list of all inventory
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

  // Loop through each item in output
  output.products.forEach((product) => {
    // Loop through each inventoryParsed
    inventoryParsed.inventory_levels.forEach((inventory) => {
      if (inventory.inventory_item_id === product.inventory_item_id)
        product.total_inventory += inventory.available;
    });
  });

  res.status(200).send(output);
});

// Endpoint does not exist
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
