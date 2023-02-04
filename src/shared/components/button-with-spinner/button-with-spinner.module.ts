import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonWithSpinnerComponent } from './button-with-spinner.component';

@NgModule({
    declarations: [ButtonWithSpinnerComponent],
    imports: [CommonModule],
    exports: [ButtonWithSpinnerComponent]
})
export class ButtonWithSpinnerModule { }
