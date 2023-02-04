import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActiveId } from 'src/shared/model/ActiveId.model';
import { DashboardService } from './_services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class HomeDashboardComponent implements OnInit {
  constructor(private injector: Injector,
    private fb: FormBuilder
  ) { }
  filterGroup: FormGroup;
  statusList: Array<ActiveId> = [
    { Id: null!, Name: "All" },
    { Id: false, Name: "In-Active" },
    { Id: true, Name: "Active" },
  ];
  get dashboard(): DashboardService {
    return this.injector.get(DashboardService);

  }


  ngOnInit(): void {
    this.createFiltrationForm();
  }
  createFiltrationForm() {
    this.filterGroup = this.fb.group({
      userName: new FormControl(
        null,
        Validators.compose([
          Validators.required,
         ])
      ),
      mobileNo: null,
      active: null,
    });
  }
}
