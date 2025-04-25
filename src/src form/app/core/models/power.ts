// power.model.ts

import { CredentialType } from "./credential";

export interface PowerInstance {
    name: string;
    functions: Record<string, boolean>;
  }