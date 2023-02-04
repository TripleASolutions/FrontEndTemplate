import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseTableService } from 'src/app/_core/shared/crud-table/services/base.table.service';
import { Observable } from 'rxjs';
import { ResponseData } from 'src/app/_core/shared/crud-table/models/response-data.model';

@Injectable({
  providedIn: 'root'
})

export class DashboardService extends BaseTableService<any> {
  httpService: any;

  constructor(http: HttpClient) {
    super(http);
    this.controller = "dashboard"
   }
  getTableHeaderAndFields() {
    return [
      { field: "id", header: "id  " },
      { field: "name", header: "Name" },

    ];
  }
}
