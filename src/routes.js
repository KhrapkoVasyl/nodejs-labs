import { ResponseStatusEnum } from './common';
import Router from './router';

const router = new Router();

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.json({
    status: ResponseStatusEnum.SUCCESS,
    message: 'Called GET method on route /',
  });
});

router.post('/', (req, res, url, payload) => {
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.json({
    status: ResponseStatusEnum.SUCCESS,
    pathname: url.pathname,
    method: req.method,
    message: 'Called POST method on route /',
    payload,
  });
});

router.put('/', (req, res, url, payload, rawRequest) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.json({
    status: ResponseStatusEnum.SUCCESS,
    pathname: url.pathname,
    method: req.method,
    message: 'Called PUT method on route /',
    payload,
    rawRequest,
  });
});

router.patch('/route', (req, res, url, payload, rawRequest) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.json({
    status: ResponseStatusEnum.SUCCESS,
    pathname: url.pathname,
    method: req.method,
    message: 'Called PATCH method on route /route',
    payload,
    rawRequest,
  });
});

router.delete('/route', (req, res, url, payload, rawRequest) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.json({
    status: ResponseStatusEnum.SUCCESS,
    pathname: url.pathname,
    method: req.method,
    message: 'Called DELETE method on route /route',
    payload,
    rawRequest,
  });
});

router.options('/route', (req, res, url, payload, rawRequest) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.json({
    status: ResponseStatusEnum.SUCCESS,
    pathname: url.pathname,
    method: req.method,
    message: 'Called OPTIONS method on route /route',
    payload,
    rawRequest,
  });
});

export default router;
