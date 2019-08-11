import validate from 'express-validation';
import { Router } from 'express';
import { updateExportPrice } from './product.controllers';
import Validations from './product.validations';
import { authJwt } from '../../service/passport';

const routes = new Router();

routes.patch('/:id', authJwt, validate(Validations.updateExportPrice), updateExportPrice);

export default routes;
