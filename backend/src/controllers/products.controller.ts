import { Request, Response } from 'express';
import * as productModel from '../models/product.model';
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().nonnegative("Quantity must be zero or positive"),
  category_id: z.string().uuid("Invalid category ID").nullable(),
  sku: z.string().max(50).optional(),
  barcode: z.string().max(50).optional(),
  weight: z.number().positive("Weight must be positive").optional(),
  dimensions: z.string().max(50).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = createProductSchema.parse(req.body);
    
    // Create product in database
    const product = await productModel.createProduct(validatedData);
    
    // Return created product
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, sort, order } = req.query;
    
    // Get products with optional filters
    const products = await productModel.getAllProducts(
      search as string | undefined,
      category as string | undefined,
      sort as string | undefined,
      order as 'asc' | 'desc' | undefined
    );
    
    res.json({
      success: true,
      data: products,
      meta: {
        count: products.length
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single product
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = updateProductSchema.parse(req.body);
    
    // Update product in database
    const product = await productModel.updateProduct(req.params.id, validatedData);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productModel.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const threshold = req.query.threshold 
      ? parseInt(req.query.threshold as string) 
      : 10;
    
    const products = await productModel.getLowStockProducts(threshold);
    
    res.json({
      success: true,
      data: products,
      meta: {
        count: products.length,
        threshold
      }
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};