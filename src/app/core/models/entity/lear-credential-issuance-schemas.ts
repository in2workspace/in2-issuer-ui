// --- Form Schemas ---

import { ValidatorEntry } from "src/app/shared/validators/credential-issuance/issuance-validators";
import { CredentialType } from "./lear-credential";


// todo unir params de control en controlConfig i de group en groupConfig
export type CredentialIssuanceFormFieldSchema = {
    type: 'control' | 'group';
    display?: 'main' | 'side' | 'pref_side'; //should it be displayed in the main space or as a side card? 'pref_side' for sections that are only displayed in main in "asSigner" mode
    // todo afegir-hi per a selector! (p. ex. country)
    controlType?: 'string' | 'number' | 'selector', // for 'control' only
    multiOptions?: SelectorOption[], //only for 'selector', 'radio' and 'checkbox'
    groupFields?: CredentialIssuanceFormSchema; //for 'group' only
    errors?: string[], // todo remove?
    validators?: ValidatorEntry[];
    // todo altres paràmetres? placeholder, 
};

export type SelectorOption  = { label: string, value: string};

//todo fer que CredentialIssuanceFormFieldSchema sigui union type de control i group
// export type CredentialIssuanceFormControlSchema = {
//   type: 'control',
//   controlType: 'string' | 'number',
//   errors?: string[],
//   validators?: ValidatorEntry[]
// }

// export type CredentialIssuanceFormGroupSchema = {
//   type: 'group';
//   display?: 'main' | 'side' | 'pref_side';
//   groupFields?: CredentialIssuanceFormSchema;
// }




  
export type CredentialIssuanceFormSchema = Record<string, CredentialIssuanceFormFieldSchema>;
  

// export const LearCredentialEmployeeIssuanceFormSchema: CredentialIssuanceFormSchema = {
//     mandatee: {
//       type: 'group',
//       display: 'main',
//       groupFields: {
//         firstName: { type: 'control', validators: [] },
//         lastName: { type: 'control' },
//         email: { type: 'control' },
//         nationality: { type: 'control' },
//       },
//     },
//     mandator: {
//       type: 'group',
//       display: 'side',
//       groupFields: commonMandatorFields,
//     },
//     issuer: {
//       type: 'group',
//       display: 'side',
//       groupFields: commonIssuerFields,
//     },
//     power: {
//       type: 'group',
//       display: 'main',
//       //content will be set dynamically
//     },
//   };
  
// todo fer directori per cada schema
export function getLearCredentialMachineIssuanceFormSchema(countries: SelectorOption[]): CredentialIssuanceFormSchema {
  return {
    mandatee: {
      type: 'group',
      display: 'main',
      groupFields: {
        domain: {
          type: 'control',
          controlType: 'string',
          validators: [{ name: 'required' }, { name: 'isDomain' }]
        },
        ipAddress: {
          type: 'control',
          controlType: 'string',
          validators: [{ name: 'required' }, { name: 'isIP' }]
        }
      }
    },
    mandator: {
      type: 'group',
      display: 'pref_side',
      groupFields: {
        organizationId: {
          type: 'control',
          controlType: 'string',
          validators: [{ name: 'required' }]
        },
        organizationName: {
          type: 'control',
          controlType: 'string',
          validators: [{ name: 'required' }]
        },
        country: {
          type: 'control',
          controlType: 'selector',
          multiOptions: countries,
          validators: [{ name: 'required' }]
        },
        commonName: {
          type: 'control',
          controlType: 'string',
          validators: [{ name: 'required' }]
        },
        serialNumber: {
          type: 'control',
          controlType: 'string',
          validators: [{ name: 'required' }]
        }
      }
    }
  };
}
    
    // todo later!
    // power: {
    //   type: 'group',
    //   display: 'main',
      //content will be set dynamically
    // },


  
  // export const VerifiableCertificationIssuanceFormSchema: CredentialIssuanceFormSchema = {
  //   attester: {
  //     type: 'group',
  //     display: 'side',
  //     groupFields: {
  //       id: { type: 'control' },
  //       firstName: { type: 'control' },
  //       lastName: { type: 'control' },
  //       organization: { type: 'control' },
  //       organizationIdentifier: { type: 'control' },
  //       country: { type: 'control' },
  //     }
  //   },
  //   issuer: {
  //     type: 'group',
  //     display: 'side',
  //     groupFields: {
  //       commonName: { type: 'control' },
  //       organization: { type: 'control' },
  //       country: { type: 'control' },
  //     },
  //   },
  //   company: {
  //     type: 'group',
  //     display: 'main',
  //     groupFields: {
  //       id: { type: 'control' },
  //       commonName: { type: 'control' },
  //       organization: { type: 'control' },
  //       country: { type: 'control' },
  //       email: { type: 'control' },
  //       address: { type: 'control' },
  //     },
  //   },
  //   product: {
  //     type: 'group',
  //     display: 'main',
  //     groupFields: {
  //       productId: { type: 'control' },
  //       productName: { type: 'control' },
  //       productVersion: { type: 'control' },
  //     },
  //   },
  //   compliance: {
  //     type: 'group',
  //     display: 'main',
  //     groupFields: {} //content will be set dynamically
  //   },
  // };
