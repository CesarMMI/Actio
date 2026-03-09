import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./infrastructure";
import { createApp } from "./api/app";

const PORT = parseInt(process.env.PORT!);

AppDataSource.initialize()
  .then(() => {
    const app = createApp(AppDataSource);
    app.listen(PORT, () => {
      console.log(`Actio API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
