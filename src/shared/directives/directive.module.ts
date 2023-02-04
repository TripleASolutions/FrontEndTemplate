import { NgModule } from '@angular/core';
 import { OnlyNumber } from './onlynumber.directive';
import { HorizontalScrollDirective } from './wheelScroll.directive';

@NgModule({
  imports: [],
  declarations: [OnlyNumber, HorizontalScrollDirective ],
  exports: [OnlyNumber, HorizontalScrollDirective],
})
export class DirectivesModule { }
