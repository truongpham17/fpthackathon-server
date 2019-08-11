import validate from 'express-validation';
import { Router } from 'express';
import * as Controllers from './report.controllers';
import { authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', authJwt, Controllers.reportByMonth);
routes.get('/byday', authJwt, Controllers.reportByDay);

export default routes;
