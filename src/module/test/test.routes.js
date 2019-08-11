import { Router } from 'express';

const routes = new Router();

routes.get('/', (res, req) => {
  req.send("Hello")
});

export default routes;
