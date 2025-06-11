import { Component, Input, computed } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CredentialIssuanceFormFieldSchema } from 'src/app/core/models/entity/lear-credential-issuance-schemas';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, ReactiveFormsModule],
  templateUrl: './dynamic-field.component.html'
})
export class DynamicFieldComponent {
  @Input({ required: true }) fieldName!: string;
  @Input({ required: true }) fieldSchema!: CredentialIssuanceFormFieldSchema;
  @Input({ required: true }) form!: FormGroup;

  control = computed(() => this.form.get(this.fieldName) as FormControl | null);
  group = computed(() => this.form.get(this.fieldName) as FormGroup | null);
  groupFields = computed(() =>
    Object.entries(this.fieldSchema.groupFields ?? {}).map(([key, value]) => ({
      key,
      value,
    }))
  );
}

