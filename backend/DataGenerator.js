const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');
const format = require('pg-format');

// Configure PostgreSQL connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'inventory_management',
  user: 'postgres',
  password: 'libid234', // Change this to your actual password
});

// Configuration
const config = {
  categories: 10,
  productsPerCategory: 10,
  suppliers: 20,
  historicalMonths: 12, // How many months of historical data to generate
  ordersPerMonth: 100, // Approximate number of orders per month
  maxOrderItems: 5 // Maximum items per order
};

// Helper to generate random number between min and max
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Helper to create a date N months ago
const monthsAgo = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
};

// Create categories table if it doesn't exist
async function createCategoriesTable() {
  console.log('Creating categories table if it doesn\'t exist...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Create suppliers table if it doesn't exist
async function createSuppliersTable() {
  console.log('Creating suppliers table...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      lead_time_days INTEGER NOT NULL DEFAULT 7,
      reliability_score NUMERIC NOT NULL DEFAULT 90,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Create products table if it doesn't exist
async function createProductsTable() {
  console.log('Creating products table if it doesn\'t exist...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      category_id UUID REFERENCES categories(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Create orders table if it doesn't exist
async function createOrdersTable() {
  console.log('Creating orders table if it doesn\'t exist...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY,
      status TEXT NOT NULL,
      total_amount NUMERIC DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Create order_items table if it doesn't exist
async function createOrderItemsTable() {
  console.log('Creating order_items table if it doesn\'t exist...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY,
      order_id UUID REFERENCES orders(id),
      product_id UUID REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price NUMERIC NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Create lead time tracking table
async function createLeadTimeTrackingTable() {
  console.log('Creating lead time tracking table...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lead_time_tracking (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      supplier_id UUID REFERENCES suppliers(id),
      product_id UUID REFERENCES products(id),
      order_date TIMESTAMP WITH TIME ZONE,
      expected_delivery_date TIMESTAMP WITH TIME ZONE,
      actual_delivery_date TIMESTAMP WITH TIME ZONE,
      expected_lead_time_days INTEGER,
      actual_lead_time_days INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Create forecasting table
async function createForecastingTable() {
  console.log('Creating forecasting table...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS forecasting (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id),
      date DATE NOT NULL,
      predicted_demand INTEGER NOT NULL,
      confidence_score NUMERIC,
      model_type TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Create product_history table for tracking stock changes over time
async function createProductHistoryTable() {
  console.log('Creating product history table...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id),
      date DATE NOT NULL,
      quantity INTEGER NOT NULL,
      change_amount INTEGER NOT NULL,
      change_type TEXT NOT NULL, -- 'order', 'restock', 'adjustment'
      reference_id UUID, -- order_id or other reference
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Seed categories
async function seedCategories() {
  console.log('Seeding categories...');
  
  const categoryValues = [];
  const categories = [];
  
  for (let i = 0; i < config.categories; i++) {
    const id = faker.string.uuid();
    const name = faker.commerce.department();
    const description = faker.commerce.productDescription();
    
    categoryValues.push([id, name, description]);
    categories.push({ id, name });
  }
  
  const query = format(
    'INSERT INTO categories (id, name, description) VALUES %L RETURNING *',
    categoryValues
  );
  
  await pool.query(query);
  return categories;
}

// Seed suppliers
async function seedSuppliers() {
  console.log('Seeding suppliers...');
  
  const supplierValues = [];
  const suppliers = [];
  
  for (let i = 0; i < config.suppliers; i++) {
    const id = faker.string.uuid();
    const name = faker.company.name();
    const contactName = faker.person.fullName();
    const email = faker.internet.email();
    const phone = faker.phone.number();
    const address = faker.location.streetAddress({ useFullAddress: true });
    const leadTimeDays = randomBetween(3, 21);
    const reliabilityScore = randomBetween(70, 100);
    
    supplierValues.push([id, name, contactName, email, phone, address, leadTimeDays, reliabilityScore]);
    suppliers.push({ id, name, leadTimeDays });
  }
  
  const query = format(
    'INSERT INTO suppliers (id, name, contact_name, email, phone, address, lead_time_days, reliability_score) VALUES %L RETURNING *',
    supplierValues
  );
  
  await pool.query(query);
  return suppliers;
}

// Seed products
async function seedProducts(categories, suppliers) {
  console.log('Seeding products...');
  
  // Alter products table to add the missing fields from frontend requirements
  await pool.query(`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS sku TEXT,
    ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10,
    ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id),
    ADD COLUMN IF NOT EXISTS lead_time_days INTEGER DEFAULT 7
  `);
  
  const productValues = [];
  const products = [];
  
  // Generate products for each category
  for (const category of categories) {
    for (let i = 0; i < config.productsPerCategory; i++) {
      const id = faker.string.uuid();
      const name = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const price = parseFloat(faker.commerce.price({ min: 5, max: 500 }));
      const quantity = randomBetween(0, 200);
      const sku = faker.string.alphanumeric(8).toUpperCase();
      const lowStockThreshold = randomBetween(5, 20);
      const supplierId = suppliers[randomBetween(0, suppliers.length - 1)].id;
      const supplierLeadTime = suppliers.find(s => s.id === supplierId).leadTimeDays;
      
      productValues.push([
        id, name, description, price, quantity, category.id, 
        sku, lowStockThreshold, supplierId, supplierLeadTime
      ]);
      
      products.push({ id, name, price, sku, categoryId: category.id });
    }
  }
  
  const query = format(
    `INSERT INTO products 
     (id, name, description, price, quantity, category_id, sku, low_stock_threshold, supplier_id, lead_time_days) 
     VALUES %L RETURNING *`,
    productValues
  );
  
  await pool.query(query);
  return products;
}

// Seed historical orders
async function seedHistoricalOrders(products) {
  console.log('Seeding historical orders...');
  
  // Add customer_id and shipping_information to orders if they don't exist
  await pool.query(`
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS customer_name TEXT,
    ADD COLUMN IF NOT EXISTS customer_email TEXT,
    ADD COLUMN IF NOT EXISTS shipping_address TEXT,
    ADD COLUMN IF NOT EXISTS shipping_method TEXT,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'
  `);
  
  // For each month in our historical period
  for (let month = config.historicalMonths; month >= 0; month--) {
    const orderDate = monthsAgo(month);
    console.log(`  - Creating orders for ${orderDate.toLocaleString('default', { month: 'long', year: 'numeric' })}...`);
    
    // Create monthly batch of orders
    const ordersToCreate = randomBetween(
      config.ordersPerMonth * 0.8, 
      config.ordersPerMonth * 1.2
    );
    
    // Add seasonal variations
    const currentMonth = orderDate.getMonth();
    let seasonalMultiplier = 1;
    
    // Holiday season (Nov-Dec)
    if (currentMonth === 10 || currentMonth === 11) {
      seasonalMultiplier = 1.5;
    }
    // Summer months (Jun-Aug)
    else if (currentMonth >= 5 && currentMonth <= 7) {
      seasonalMultiplier = 1.3;
    }
    // Slow season (Jan-Feb)
    else if (currentMonth <= 1) {
      seasonalMultiplier = 0.7;
    }
    
    const adjustedOrders = Math.floor(ordersToCreate * seasonalMultiplier);
    
    // Generate batch of orders for this month
    for (let i = 0; i < adjustedOrders; i++) {
      // Create random date within the month
      const orderDay = new Date(orderDate);
      orderDay.setDate(randomBetween(1, 28)); // Avoid month overflow issues
      
      // Random order details
      const orderId = faker.string.uuid();
      const customerName = faker.person.fullName();
      const customerEmail = faker.internet.email();
      const shippingAddress = faker.location.streetAddress({ useFullAddress: true });
      const shippingMethod = faker.helpers.arrayElement(['Standard', 'Express', 'Next Day', 'Pickup']);
      const status = faker.helpers.arrayElement([
        'pending', 'processing', 'shipped', 'delivered', 'cancelled'
      ]);
      const paymentStatus = faker.helpers.arrayElement([
        'pending', 'paid', 'failed', 'refunded'
      ]);
      const notes = Math.random() > 0.7 ? faker.lorem.sentence() : null;
      
      // Insert order
      const orderResult = await pool.query(
        `INSERT INTO orders 
         (id, status, customer_name, customer_email, shipping_address, shipping_method, notes, payment_status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9) 
         RETURNING *`,
        [orderId, status, customerName, customerEmail, shippingAddress, shippingMethod, notes, paymentStatus, orderDay]
      );
      
      // Add order items
      const numItems = randomBetween(1, config.maxOrderItems);
      const selectedProducts = [];
      let totalAmount = 0;
      
      // Select random products for this order (without duplicates)
      while (selectedProducts.length < numItems && selectedProducts.length < products.length) {
        const product = products[randomBetween(0, products.length - 1)];
        if (!selectedProducts.find(p => p.id === product.id)) {
          selectedProducts.push(product);
        }
      }
      
      // Generate order items
      const orderItemValues = selectedProducts.map(product => {
        const quantity = randomBetween(1, 5);
        const unitPrice = product.price;
        totalAmount += unitPrice * quantity;
        
        return [
          faker.string.uuid(),
          orderId,
          product.id,
          quantity,
          unitPrice,
          orderDay
        ];
      });
      
      if (orderItemValues.length > 0) {
        const orderItemsQuery = format(
          'INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, created_at) VALUES %L',
          orderItemValues
        );
        
        await pool.query(orderItemsQuery);
        
        // Update order total
        await pool.query(
          'UPDATE orders SET total_amount = $1 WHERE id = $2',
          [totalAmount, orderId]
        );
      }
    }
  }
}

// Seed historical product inventory levels
async function seedProductHistory(products) {
  console.log('Seeding product history...');
  
  // Get all order items to build history
  const { rows: allOrderItems } = await pool.query(`
    SELECT oi.product_id, oi.quantity, o.created_at, oi.order_id
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    ORDER BY o.created_at ASC
  `);
  
  // Group by product
  const productOrders = {};
  allOrderItems.forEach(item => {
    if (!productOrders[item.product_id]) {
      productOrders[item.product_id] = [];
    }
    productOrders[item.product_id].push({
      date: new Date(item.created_at),
      quantity: item.quantity,
      orderId: item.order_id
    });
  });
  
  // For each product, create its history
  for (const product of products) {
    const orders = productOrders[product.id] || [];
    
    // Get initial quantity (current)
    const { rows } = await pool.query('SELECT quantity FROM products WHERE id = $1', [product.id]);
    const currentQuantity = rows[0]?.quantity || 0;
    
    // Work backwards from current quantity
    let runningQuantity = currentQuantity;
    const historyRecords = [];
    
    // Add order deductions
    orders.forEach(order => {
      const orderQuantity = order.quantity;
      // Add the record for deduction
      historyRecords.push({
        productId: product.id,
        date: order.date,
        quantityAfter: runningQuantity,
        changeAmount: -orderQuantity,
        changeType: 'order',
        referenceId: order.orderId
      });
      
      // Update running quantity (going backwards)
      runningQuantity += orderQuantity;
    });
    
    // Add some random restocks (approximately one per month)
    for (let month = 0; month <= config.historicalMonths; month++) {
      const restockDate = monthsAgo(month);
      // Random between 10-100 units
      const restockAmount = randomBetween(10, 100);
      
      historyRecords.push({
        productId: product.id,
        date: restockDate,
        quantityAfter: runningQuantity,
        changeAmount: restockAmount,
        changeType: 'restock',
        referenceId: null
      });
      
      // Update running quantity (going backwards)
      runningQuantity -= restockAmount;
    }
    
    // Sort records chronologically
    historyRecords.sort((a, b) => a.date - b.date);
    
    // Insert the history records
    const historyValues = historyRecords.map(record => [
      faker.string.uuid(),
      record.productId,
      record.date.toISOString().split('T')[0], // Date only
      record.quantityAfter, 
      record.changeAmount,
      record.changeType,
      record.referenceId,
      record.date // created_at timestamp
    ]);
    
    if (historyValues.length > 0) {
      const query = format(
        `INSERT INTO product_history 
         (id, product_id, date, quantity, change_amount, change_type, reference_id, created_at) 
         VALUES %L`,
        historyValues
      );
      
      await pool.query(query);
    }
  }
}

// Generate simple forecasts based on historical data
async function generateForecasts(products) {
  console.log('Generating forecasts...');
  
  for (const product of products) {
    // Get historical sales by month for this product
    const { rows: salesHistory } = await pool.query(`
      SELECT 
        date_trunc('month', o.created_at) as month,
        SUM(oi.quantity) as total_sold
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = $1
      GROUP BY date_trunc('month', o.created_at)
      ORDER BY date_trunc('month', o.created_at) ASC
    `, [product.id]);
    
    if (salesHistory.length === 0) continue;
    
    // Simple forecasting - use average of last 3 months if available, otherwise use all available data
    let forecastAmount = 0;
    if (salesHistory.length >= 3) {
      // Use last 3 months
      const last3Months = salesHistory.slice(-3);
      forecastAmount = Math.round(last3Months.reduce((sum, month) => sum + parseInt(month.total_sold), 0) / 3);
    } else {
      // Use all available data
      forecastAmount = Math.round(salesHistory.reduce((sum, month) => sum + parseInt(month.total_sold), 0) / salesHistory.length);
    }
    
    // Add some randomness to forecasts
    forecastAmount = Math.max(1, Math.round(forecastAmount * (0.8 + Math.random() * 0.4))); // 80-120% of calculated value
    
    // Generate forecasts for next 3 months
    const forecastValues = [];
    for (let i = 1; i <= 3; i++) {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      // Add seasonal adjustments to forecasts
      const forecastMonth = forecastDate.getMonth();
      let seasonalMultiplier = 1;
      
      // Holiday season (Nov-Dec)
      if (forecastMonth === 10 || forecastMonth === 11) {
        seasonalMultiplier = 1.5;
      }
      // Summer months (Jun-Aug)
      else if (forecastMonth >= 5 && forecastMonth <= 7) {
        seasonalMultiplier = 1.3;
      }
      // Slow season (Jan-Feb)
      else if (forecastMonth <= 1) {
        seasonalMultiplier = 0.7;
      }
      
      const adjustedForecast = Math.round(forecastAmount * seasonalMultiplier);
      const confidenceScore = randomBetween(70, 95); // Random confidence score
      
      forecastValues.push([
        faker.string.uuid(),
        product.id,
        forecastDate.toISOString().split('T')[0], // Date only
        adjustedForecast,
        confidenceScore,
        'SMA', // Simple Moving Average
      ]);
    }
    
    if (forecastValues.length > 0) {
      const query = format(
        `INSERT INTO forecasting 
         (id, product_id, date, predicted_demand, confidence_score, model_type) 
         VALUES %L`,
        forecastValues
      );
      
      await pool.query(query);
    }
  }
}

// Main function
async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Step 1: Create all tables in the correct dependency order
    // First, create tables with no dependencies
    await createCategoriesTable();
    await createSuppliersTable();
    
    // Then create tables that depend on categories and suppliers
    await createProductsTable();
    
    // Then create tables that depend on products
    await createOrdersTable();
    await createOrderItemsTable();
    await createLeadTimeTrackingTable();
    await createForecastingTable();
    await createProductHistoryTable();
    
    // Step 2: Seed data in the correct order
    const categories = await seedCategories();
    const suppliers = await seedSuppliers();
    const products = await seedProducts(categories, suppliers);
    await seedHistoricalOrders(products);
    await seedProductHistory(products);
    await generateForecasts(products);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedDatabase();
