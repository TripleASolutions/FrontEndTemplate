import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicContainerComponent } from './components/dynamic-container.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { DynamicDialogComponent } from './components/dynamic-dialog/dynamic-dialog.component';
 import { MatTooltipModule } from '@angular/material/tooltip';
 import { CRUDTableModule } from 'src/app/_core/shared/crud-table';
import { DirectivesModule } from 'src/shared/directives/directive.module';

@NgModule({
  declarations: [DynamicContainerComponent, DynamicDialogComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    MatTooltipModule,
    DirectivesModule,
    NgbDatepickerModule
  ],

  entryComponents: [DynamicDialogComponent],
  exports: [
    DynamicContainerComponent,
    DynamicDialogComponent
  ]
})
export class DynamicContainerModule { }
