import {
  ErrorMessageEnum,
  HttpMethodEnum,
  responseHelpers,
  ResponseStatusEnum,
  safeJSON,
} from './common';

export const processedContentTypes = {
  'text/html': (text) => text,
  'text/plain': (text) => text,
  'application/json': (json) => safeJSON(json, {}),
  'application/x-www-form-urlencoded': (data) => {
    return Object.fromEntries(new URLSearchParams(data));
  },
};

class Router {
  routes = new Map();

  constructor() {
    this.defineDefaultMethods();
  }

  async handleRequest(req, res) {
    const url = new URL(req.url || '/', `https://${req.headers.host}`);
    const routeModule = this.routes.get(url.pathname) ?? {};
    const routeMethod = routeModule[req?.method];
    const handler = routeMethod?.handler ?? this.defaultHandler;
    let payload = {};
    let rawRequest = '';
    for await (const chunk of req) {
      rawRequest += chunk;
    }

    if (req.headers['content-type']) {
      const contentType = req.headers['content-type'].split(';')[0];
      if (processedContentTypes[contentType]) {
        payload = processedContentTypes[contentType](rawRequest);
      }
    }

    try {
      handler(
        req,
        Object.assign(res, responseHelpers),
        url,
        payload,
        rawRequest
      );
    } catch (err) {
      this.handleError(res, err);
    }
  }

  defineMethod(method) {
    return (routeUrl, handler, options = { isStreamable: true }) => {
      const routeModule = this.routes.get(routeUrl);
      if (routeModule && routeModule[method]) {
        throw new Error(
          ErrorMessageEnum.ROUTE_WITH_SPECIFIED_METHOD_ALREADY_REGISTERED
        );
      }

      this.routes.set(routeUrl, {
        ...routeModule,
        [method]: {
          handler,
          options,
        },
      });
    };
  }

  defineDefaultMethods() {
    this.get = this.defineMethod(HttpMethodEnum.GET);
    this.post = this.defineMethod(HttpMethodEnum.POST);
    this.put = this.defineMethod(HttpMethodEnum.PUT);
    this.patch = this.defineMethod(HttpMethodEnum.PATCH);
    this.delete = this.defineMethod(HttpMethodEnum.DELETE);
    this.options = this.defineMethod(HttpMethodEnum.OPTIONS);
  }

  defaultHandler(req, res, url) {
    res
      .writeHead(400, {
        'Content-Type': 'application/json',
      })
      .json({
        status: ResponseStatusEnum.FAIL,
        message: `${ErrorMessageEnum.HTTP_METHOD_NOT_IMPLEMENTED}`,
        method: req.method,
        url,
      });
  }

  handleError(res, err) {
    const message =
      process.env.NODE_ENV === 'PRODUCTION'
        ? ErrorMessageEnum.INTERNAL_SERVER_ERROR
        : err;

    res
      .writeHead(500, {
        'Content-Type': 'application/json',
      })
      .json({
        status: ResponseStatusEnum.FAIL,
        message,
      });
  }
}

export default Router;
