import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Checkins
routes.post('/:student_id/checkins', CheckinController.store);
routes.get('/:student_id/checkins', CheckinController.index);

// Help Orders
routes.get('/students/:student_id?/help-orders', HelpOrderController.index);
routes.get('/students/help-orders', HelpOrderController.index);
routes.post('/students/:student_id/help-orders', HelpOrderController.store);

// Middlewares
routes.use(authMiddlewares);

// Answer
routes.post('/help-orders/:id/answer', AnswerController.store);

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
