import { ModuleInfos } from "./moduleInfos";

export interface ProfileInfos {
      id: number;
      name: string;
      description: string;
      modules: ModuleInfos[]
      };