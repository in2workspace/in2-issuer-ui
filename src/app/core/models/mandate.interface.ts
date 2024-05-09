import { Mandatee } from "./mandatee.interface";

export interface Mandate {
  id:string;
  status: string;
  name: string;
  updated: string;
  mandatee: Mandatee;
}

export interface LifeSpan {
  start_date_time?: string;
  end_date_time?: string;
}
