import HTTPStatus from 'http-status';

export function roleAdmin(req, res, next) {
  if (req.user.role === 2) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}

export function roleMod(req, res, next) {
  if (req.user.role >= 2) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}
