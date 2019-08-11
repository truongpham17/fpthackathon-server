'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

const routes = new _express.Router();

routes.get('/', (res, req) => {
  req.send('Hello');
});

exports.default = routes;