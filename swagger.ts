// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Review API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.ts"],
});
