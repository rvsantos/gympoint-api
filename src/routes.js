import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddlewares);

// Students
routes.post('/students', StudentController.store);

// Plans
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);

export default routes;
