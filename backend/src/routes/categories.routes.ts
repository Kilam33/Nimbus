// src/routes/categories.routes.ts
import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller';
import { validate } from '../middleware/validation.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema
} from '../validations/category.validations';

const router = Router();

router.post('/', validate({ body: createCategorySchema }), createCategory);
router.get('/', validate({ query: categoryQuerySchema }), getCategories);
router.get('/:id', getCategory);
router.put('/:id', validate({ body: updateCategorySchema }), updateCategory);
router.delete('/:id', deleteCategory);

export default router;