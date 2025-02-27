export interface TempPower {
  action: string | string[];
  domain: string;
  function: string;
  type: string;
  execute: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  upload: boolean;
  attest: boolean;
}
