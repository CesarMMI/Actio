import "reflect-metadata";
import "dotenv/config";
import { SqliteDataSource } from "./infrastructure";
import { createApp } from "./api/app";

const port = parseInt(process.env.PORT!);
const dataSource = new SqliteDataSource(process.env);

dataSource
  .initialize()
  .then(() => {
    const app = createApp(dataSource);
    app.listen(port, () => {
      console.log(`Actio API running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
