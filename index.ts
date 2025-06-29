import "reflect-metadata"; // ✅ Required by TypeORM decorators
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import bookRoute from "./routes/bookRoutes";
import { AppDataSource } from "./database/data"; // ✅ Ensure correct path

const app = express();
const PORT = 3001;

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "📚 Book Review API Docs",
    customfavIcon: "https://tse3.mm.bing.net/th/id/OIP.BFCaGY_F9i70fzEPZH-rNQHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    customCss: ".swagger-ui .topbar { display: none }",
  })
);


// ✅ Routes
app.use("/book", bookRoute);

// ✅ Initialize DB and start server
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization", err);
  });
