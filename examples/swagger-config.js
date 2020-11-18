const version = process.env.VERSION;
const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'Demo server',
    version,
    description: 'Random description on API related stuff',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Host system path',
    },
  ],
  definitions: {},
  paths: {},
};

// options for the swagger docs
const options = (fileName) => ({
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: [fileName],
});

module.exports = options;
