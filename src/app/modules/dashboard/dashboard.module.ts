  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeDashboardComponent } from './dashboard.component';
 import { DynamicContainerModule } from '../dynamic-container/dynamic-container.module';
import { MaterialModule } from 'src/shared/components/Material/MaterialModule';
import { CRUDTableModule } from 'src/app/_core/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'src/shared/directives/directive.module';


@NgModule({
  declarations: [HomeDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeDashboardComponent,
      },
    ]),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    InlineSVGModule,
    CRUDTableModule,
     DynamicContainerModule,
      NgbModule,
    DirectivesModule,

   ],
})

export class HomeDashboardModule {

}
