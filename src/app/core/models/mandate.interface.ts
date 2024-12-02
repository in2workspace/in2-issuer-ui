import {LifeSpan} from "./lifeSpan.interface";
import {CredentialMandatee} from "./credendentialMandatee.interface";
import {Mandator} from "./mandator.interface";
import {Power} from "./power.interface";

export interface Mandate {
  id: string;
  life_span: LifeSpan;
  mandatee: CredentialMandatee;
  mandator: Mandator;
  power: Power[];
}
