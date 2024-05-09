export interface Option {
  name: string;
  execute: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface Power {
  id: string;
  tmf_type: string;
  tmf_domain: string[];
  tmf_function: string;
  tmf_action: string[];
}
