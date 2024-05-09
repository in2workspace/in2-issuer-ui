
import { Option } from 'src/app/core/models/option.interface';
export interface Mandatee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  gender?: string;
  options: Option[];
}
