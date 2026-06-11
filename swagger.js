const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API FM Abattage",
      version: "1.0.0",
      description: "Documentation API du logiciel de gestion FM Abattage"
    },
    servers: [
      {
        url: "https://fmabattage-management-app-1.onrender.com"
      }
    ]
  },

  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;