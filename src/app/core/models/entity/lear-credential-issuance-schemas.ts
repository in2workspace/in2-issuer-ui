// --- Form Schemas ---

import { ValidatorEntry } from "src/app/shared/validators/credential-issuance/issuance-validators";
import { Power } from "./lear-credential";

// todo unir params de control en controlConfig i de group en groupConfig
export type CredentialIssuanceFormFieldSchema = {
    type: 'control' | 'group';
    ignore?: boolean, // sets if it will be used to build form (model and view)
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
export interface IssuanceFormSchemaPower extends Power{
  isIn2Required: boolean
}
export type CredentialIssuancePowerFormSchema = { power: IssuanceFormSchemaPower[]}
  

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
export function getLearCredentialMachineIssuanceFormSchemas(countries: SelectorOption[]): [CredentialIssuanceFormSchema, CredentialIssuancePowerFormSchema] {
  return [{
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
    },
  }, 
  { 
    power: [
      {
          "id": "4acd944a-e137-487f-a3f3-3bf4f71d191a",
          "action": "Execute",
          "domain": "DOME",
          "function": "Onboarding",
          "type": "Domain",
          isIn2Required: true
      },
      {
          "id": "f7da3294-81cd-42a3-b676-71bf9e982957",
          "action": [
              "Create",
              "Update",
              "Delete",
          ],
          "domain": "DOME",
          "function": "ProductOffering",
          "type": "Domain",
          isIn2Required: false
      },
      {
          "id": "3e272252-647f-4158-943e-6661c117c184",
          "action": [
              "Upload",
              "Attest"
          ],
          "domain": "DOME",
          "function": "Certification",
          "type": "Domain",
          isIn2Required: false
      }
  ]
  }];
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
