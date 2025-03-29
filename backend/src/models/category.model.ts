import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  const id = uuidv4();
  const { name, description } = categoryData;
  
  const result = await query(
    `INSERT INTO categories (id, name, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id, name, description]
  );
  
  return result.rows[0];
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const result = await query('SELECT * FROM categories ORDER BY name');
  return result.rows;
};

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category | null> => {
  const { name, description } = categoryData;
  
  const result = await query(
    `UPDATE categories SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, name, description]
  );
  
  return result.rows[0] || null;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await query('DELETE FROM categories WHERE id = $1', [id]);
};

export const getCategoryItemCount = async (id: string): Promise<number> => {
  const result = await query(
    'SELECT COUNT(*) FROM products WHERE category_id = $1',
    [id]
  );
  return parseInt(result.rows[0].count, 10);
};