import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, Input, Output } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
 
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-group-material',
  templateUrl: './form-group-material.component.html',
  styleUrls: ['./form-group-material.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      transition(':enter', [animate('700ms linear', style({ opacity: 0 }))]),
    ]),
  ],
})
export class FormGroupMaterialComponent implements OnInit, AfterViewInit {
  inputPassword: boolean;
  @Input() fieldLabel: string;
  @Input() error: any;
  @Input() fieldMinLingth: number;
  @Input() fieldMaxLingth: number;
  @Input() FormGroup: FormGroup;
  @Input() hint: string;
  @Input() inputType: string;
  @Input() OnlyNumber: boolean=false;
  @Input() maxlengthLimit: number;
  @Input() inputPlaceholder: string;
  @Input() data: any;
  @Input() controlName: string;
  @Input() dataSource: any[];
  @Input() matSuffix: string;
  @Input() maxValue: number;
  @Input() minValue: number;
  @Input() minmumValueNumber: number;
  @Input() MaximumValueNumber: number;
  @Input() requiredField: true;
  @Input() matPrefix: string;
  @Input() matPrefixIcon: string;
  @Input() lazyInput: boolean;

  @Input() fieldName = 'Name';
  @Input() fieldValue = 'Id';

  @Output() changeValue: EventEmitter<number>;

  constructor() {
    this.fieldLabel = '';
    this.fieldMinLingth = undefined!;
    this.fieldMaxLingth = undefined!;
    this.hint = '';
    this.inputType = '';
    this.inputPlaceholder = '';
    this.controlName = '';
    this.dataSource = [];
    this.maxValue = null!;
    this.minValue = null!;
    this.changeValue = new EventEmitter();
  }

  ngOnInit(): void {
    this.inputType === 'password'
      ? (this.inputPassword = true)
      : (this.inputPassword = false);
  }
  ngAfterViewInit(): void {


  }
  onChangeValue(event: any): void {
    if (event && event.value !== undefined) {
      const id = event.value;
      this.changeValue.emit(+id);
    }
  }
  isControlValid(): boolean {
    const control = this.FormGroup.controls[this.controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(): boolean {
    const control = this.FormGroup.controls[this.controlName];

    return (
      control.invalid &&
      (control.hasError('pattern') || control.hasError('email') || control.hasError('invalid'))
    );
  }

  controlHasError(validation:any): boolean {
    const control = this.FormGroup.controls[this.controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(): boolean {
    const control = this.FormGroup.controls[this.controlName];
    return control.dirty || control.touched;
  }
  controlHasMinValError(): boolean {
    const control = this.FormGroup.controls[this.controlName];
    return control.hasError('InvalidMinVal') && (control.dirty || control.touched);
  }

  controlHasMaxValError() {
    const control = this.FormGroup.controls[this.controlName];
    return control.hasError('InvalidMaxVal') && (control.dirty || control.touched);
  }


}
