const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'TimeTables API', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'API for managing TimeTables', // Description
    },
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
    security: [{
      Bearer: []
    }],
    servers: ['http://localhost:4000'], // your server URL
  },
  apis: ['./controllers/*.js', './routes/user/userRoutes.js'],
};

const specs = swaggerJSDoc(options);

module.exports = specs;