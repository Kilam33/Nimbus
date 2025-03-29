import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} from '../controllers/products.controller';
import { validate } from '../middleware/validation.middleware';
import { 
  createProductSchema, 
  updateProductSchema,
  productQuerySchema 
} from '../validations/product.validations';

const router = Router();

// GET /api/products
router.get('/', validate({ query: productQuerySchema }), getProducts);
router.get('/:id', getProduct);
router.post('/', validate({ body: createProductSchema }), createProduct);
router.put('/:id', validate({ body: updateProductSchema }), updateProduct);
router.get('/low-stock', getLowStockProducts);
router.delete('/:id', deleteProduct);


export default router;