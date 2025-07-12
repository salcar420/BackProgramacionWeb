import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, adminController.getDashboard);

export default router;
