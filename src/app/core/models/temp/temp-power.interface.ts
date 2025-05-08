import { TmfAction, TmfFunction } from "../entity/lear-credential-employee.entity";

export interface TempPower {
  action: string | TmfAction[] | '';
  domain: string;
  function: TmfFunction;
  type: string;
  execute: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  upload: boolean;
  attest: boolean;
}
