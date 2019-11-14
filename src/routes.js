import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddlewares);

// Students
routes.post('/students', StudentController.store);

// Plans
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Registrations
routes.post('/registrations', RegistrationController.store);
routes.get('/registrations/:inactive?', RegistrationController.index);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

export default routes;
