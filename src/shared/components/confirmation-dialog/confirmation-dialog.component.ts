 import { Component, ElementRef, EventEmitter, Inject, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],

})

export class ConfirmationDialog implements   AfterViewInit {
  message: string = "Are you sure?";
  confirmButtonText = "Yes";
  Title = "Confirmation";
  cancelButtonText = "Cancel";
  actionResponse: EventEmitter<{ actionResponse: boolean; }> = new EventEmitter();
  @ViewChild('dialogConfirm') dialogConfirmRef: ElementRef = {} as ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialog>) {

    if (data) {
      this.message = data.message || this.message;
      this.Title = data.Title || this.Title;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  ngAfterViewInit(){
     this.dialogConfirmRef.nativeElement?.classList.add('start-shake');
  }
  onConfirmClick(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }

}
