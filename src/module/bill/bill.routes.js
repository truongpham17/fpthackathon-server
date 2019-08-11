import validate from 'express-validation';
import { Router } from 'express';
import * as Controllers from './bill.controllers';
import Validations from './bill.validations';
import { authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', authJwt, Controllers.getBillList);
routes.get('/return', authJwt, Controllers.getReturnedBillList);
routes.get('/:id', authJwt, Controllers.getBillDetail);
routes.post('/', authJwt, validate(Validations.createBill), Controllers.createBill);
routes.post('/return', authJwt, validate(Validations.createReturnedBill), Controllers.returnToSupplier);
routes.patch('/paid/:id', authJwt, Controllers.paidBill);

export default routes;
