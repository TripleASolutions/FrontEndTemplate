import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InlineSVGModule } from 'ng-inline-svg';
import { DirectivesModule } from 'shared/directives/directive.module';
import { FormGroupMaterialComponent } from './form-group-material.component';

@NgModule({
  declarations: [FormGroupMaterialComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    InlineSVGModule,
    DirectivesModule,

  ],
  exports: [
    FormGroupMaterialComponent
  ],
  entryComponents: [FormGroupMaterialComponent],
})
export class FormGroupMaterialModule { }
