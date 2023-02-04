import { BaseTableService } from 'src/app/_core/shared/crud-table/services/base.table.service';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableExtendedService extends BaseTableService<any> {
  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http);
  }
}
