/**
 * Written in Javascript due to ease of parsing JSON
 * Might re-write in Typescript later on.
 */

const swaggerJSDoc = require('swagger-jsdoc');

const {
  parseSwaggerRouteData,
  writeAsSwaggerDocToFile,
  debugLogger,
  replaceRoutes,
} = require('@tiemma/sonic-core');

const logger = debugLogger(__filename);
const parameterRegex = /(:\w+\??)/g;

const normalizePath = (path) => (path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path);

const getResponseExpress = (app, swaggerOptions, swaggerFilePath) => {
  // Set state of swaggerSpec on first request
  // Update and write in-memory spec to file
  const swaggerSpec = swaggerOptions ? swaggerJSDoc(swaggerOptions) : {};
  const { definitionMap } = swaggerOptions ? parseSwaggerRouteData(swaggerSpec, {}) : {};
  const serverUrls = swaggerOptions ? swaggerSpec.servers.map((x) => x.url) : [];
  const domainsRegex = new RegExp(`(${serverUrls.join('|')})`);
  logger('Sonic middleware initiated');

  return (req, res, next) => {
    const { send } = res;
    // eslint-disable-next-line func-names
    res.send = function (responseBody) {
      const domain = req.baseUrl.split(domainsRegex).slice(2);

      if (domain.length > 0) {
        const originalRoute = res.req.route
          ? domain.join('/') + res.req.route.path
          : req.url;
        const { method } = res.req;
        let definitionName;
        const route = replaceRoutes(originalRoute, parameterRegex);
        if (
          definitionMap[route]
                    && definitionMap[route][method]
        ) {
          definitionName = definitionMap[route][method];
        }
        const { body: requestBody, query: queries } = res.req;
        const contentType = (res.get('Content-Type') || 'text/html').split(';')[0];
        const { statusCode } = res;
        writeAsSwaggerDocToFile(swaggerSpec,
          method.toLowerCase(),
          normalizePath(originalRoute),
          parameterRegex,
          responseBody,
          requestBody,
          queries,
          statusCode,
          contentType,
          definitionName,
          swaggerFilePath);
      }
      // eslint-disable-next-line prefer-rest-params
      return send.apply(this, arguments);
    };
    return next();
  };
};
module.exports = { getResponseExpress };
