import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category_id: string | null;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  created_at: Date;
  updated_at: Date;
}

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const id = uuidv4();
  const { name, description, price, quantity, category_id, sku, barcode, weight, dimensions } = productData;
  
  const result = await query(
    `INSERT INTO products (
      id, name, description, price, quantity, category_id, sku, barcode, weight, dimensions
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *`,
    [id, name, description, price, quantity, category_id, sku, barcode, weight, dimensions]
  );
  
  return result.rows[0];
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const result = await query(
    `SELECT p.*, c.name as category_name 
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`, 
    [id]
  );
  return result.rows[0] || null;
};

// Get all products with filtering and sorting
export const getAllProducts = async (
  searchTerm?: string, 
  categoryId?: string,
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<Product[]> => {
  let queryText = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  
  const params = [];
  const conditions = [];
  
  if (searchTerm) {
    conditions.push(`(p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`);
    params.push(`%${searchTerm}%`);
  }
  
  if (categoryId) {
    conditions.push(`p.category_id = $${params.length + 1}`);
    params.push(categoryId);
  }
  
  if (conditions.length) {
    queryText += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  // Validate sort column to prevent SQL injection
  const validSortColumns = ['name', 'price', 'quantity', 'created_at'];
  const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'name';
  
  queryText += ` ORDER BY p.${safeSortBy} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
  
  const result = await query(queryText, params);
  return result.rows;
};

// Update product
export const updateProduct = async (
  id: string, 
  productData: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product | null> => {
  const { name, description, price, quantity, category_id, sku, barcode, weight, dimensions } = productData;
  
  const result = await query(
    `UPDATE products SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      price = COALESCE($4, price),
      quantity = COALESCE($5, quantity),
      category_id = COALESCE($6, category_id),
      sku = COALESCE($7, sku),
      barcode = COALESCE($8, barcode),
      weight = COALESCE($9, weight),
      dimensions = COALESCE($10, dimensions),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *`,
    [id, name, description, price, quantity, category_id, sku, barcode, weight, dimensions]
  );
  
  return result.rows[0] || null;
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  await query('DELETE FROM products WHERE id = $1', [id]);
};

// Get low stock products
export const getLowStockProducts = async (threshold: number = 10): Promise<Product[]> => {
  const result = await query(
    `SELECT p.*, c.name as category_name 
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.quantity <= $1
     ORDER BY p.quantity ASC`,
    [threshold]
  );
  return result.rows;
};