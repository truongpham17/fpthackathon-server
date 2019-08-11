import validate from 'express-validation';
import { Router } from 'express';
import * as StoreControllers from './store.controllers';
import Validations from './store.validations';
import { authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', authJwt, StoreControllers.getStoreList);
routes.get('/:id', authJwt, StoreControllers.getStoreInfo);
routes.get('/:id/products', authJwt, StoreControllers.getStoreProducts);
routes.get('/:id/history', authJwt, StoreControllers.getStoreHistory);
routes.post('/', authJwt, validate(Validations.createStore), StoreControllers.createStore);
routes.post('/import', authJwt, validate(Validations.importStore), StoreControllers.importStore);
routes.patch('/:id', authJwt, validate(Validations.editStore), StoreControllers.updateStore);
routes.delete('/:id', authJwt, StoreControllers.deleteStore);

export default routes;
