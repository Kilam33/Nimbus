import { Request, Response } from 'express';
import * as categoryModel from '../models/category.model';
import {
  createCategorySchema,
  updateCategorySchema
} from '../validations/category.validations';
import { z } from 'zod';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await categoryModel.createCategory(validatedData);
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      console.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.getAllCategories();
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const itemCount = await categoryModel.getCategoryItemCount(category.id);
        return { ...category, item_count: itemCount };
      })
    );
    
    res.json({
      success: true,
      data: categoriesWithCounts,
      meta: {
        count: categoriesWithCounts.length
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const itemCount = await categoryModel.getCategoryItemCount(req.params.id);
    res.json({
      success: true,
      data: { ...category, item_count: itemCount }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = updateCategorySchema.parse(req.body);
    const category = await categoryModel.updateCategory(req.params.id, validatedData);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      console.error('Error updating category:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryModel.deleteCategory(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};