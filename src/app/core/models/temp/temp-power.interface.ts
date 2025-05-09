import { TmfAction, TmfFunction } from "../entity/lear-credential";

export interface TempPower {
  action: TmfAction | TmfAction[] | '';
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
