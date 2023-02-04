import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
@Component({
  selector: "app-button-with-spinner",
  templateUrl: "./button-with-spinner.component.html",
  styleUrls: ["./button-with-spinner.component.scss"],
})
export class ButtonWithSpinnerComponent implements OnInit {
  @Input() submitted;
  @Input() title="Submit";
  @Output() submit: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
  onSubmit() {
    this.submit.emit(true);
  }
}
