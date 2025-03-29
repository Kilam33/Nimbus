import { Router } from 'express';
import productsRouter from './products.routes';
import categoriesRouter from './categories.routes';
//import ordersRouter from './orders.routes';
//import analyticsRouter from './analytics.routes';
//import alertsRouter from './alerts.routes';
//import shipmentsRouter from './shipments.routes';

const router = Router();

router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
//router.use('/orders', ordersRouter);
//router.use('/analytics', analyticsRouter);
//router.use('/alerts', alertsRouter);
//router.use('/shipments', shipmentsRouter);

export default router;