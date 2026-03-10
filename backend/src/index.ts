import "dotenv/config";
import "reflect-metadata";
import { injectApi } from "./api/di";
import { injectApplication } from "./application/di";
import { DiContainer } from "./di-container/di-container";
import { injectInfrastructure } from "./infrastructure/di";

const container = new DiContainer();
const env = process.env;

injectInfrastructure(container, env)
  .then((container) => injectApplication(container, env)
  .then((container) => injectApi(container, env)))  
  .catch((err: Error) => {
    console.error("Failed to start", err);
    process.exit(1);
  });
