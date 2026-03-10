import { DiContainer } from "./di-container";

export interface Injector {
  (container: DiContainer, env: NodeJS.ProcessEnv): Promise<DiContainer>;
}
