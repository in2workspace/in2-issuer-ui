import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { CredentialIssuanceFormSchema } from "src/app/core/models/entity/lear-credential-issuance-schemas";
import { ALL_VALIDATORS_FACTORY_MAP, ValidatorEntry } from "src/app/shared/validators/credential-issuance/issuance-validators";

export function buildFormFromSchema(
  schema: CredentialIssuanceFormSchema
): FormGroup {
  const group: Record<string, any> = {};

  for (const [key, field] of Object.entries(schema)) {
     if (field.type === 'control') {
        //todo null com a init value?
        group[key] = new FormControl(null, buildValidators(field.validators));
    } else if (field.type === 'group') {
      group[key] = buildFormFromSchema(field.groupFields!);
    }
  }

  return new FormGroup(group);
}

function buildValidators(entries: ValidatorEntry[] = []): ValidatorFn[] {
  return entries
    .map(val => {
      const factory = ALL_VALIDATORS_FACTORY_MAP[val.name];
      return factory ? factory(...(val.args ?? [])) : null;
    })
    .filter((v): v is ValidatorFn => v !== null);
}
