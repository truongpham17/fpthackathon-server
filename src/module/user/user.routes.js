import validate from 'express-validation';
import { Router } from 'express';
import {
  getUserList,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from './user.controllers';
import Validations from './user.validations';
import { authLocal, authJwt } from '../../service/passport';

const routes = new Router();

routes.get('/', authJwt, getUserList);
routes.get('/:id', authJwt, getUser);
routes.post('/login', validate(Validations.login), authLocal);
routes.post('/add', authJwt, validate(Validations.createUser), createUser);
routes.patch('/:id', authJwt, validate(Validations.editProfile), updateUser);
routes.delete('/:id', authJwt, deleteUser);

export default routes;
