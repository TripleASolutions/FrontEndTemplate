import {
  Component,
  Input,
  EventEmitter,
  Output, OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DynamicDialogComponent } from './dynamic-dialog/dynamic-dialog.component';
import { Router } from '@angular/router';
import { PaginatorState, SortState, GroupingState } from 'src/app/_core/shared/crud-table';
import { BaseTableService } from 'src/app/_core/shared/crud-table/services/base.table.service';
  @Component({
  selector: 'app-dynamic-container',
  templateUrl: './dynamic-container.component.html',
  styleUrls: ['./dynamic-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DynamicContainerComponent<T> implements OnInit, OnDestroy {
  @ViewChild('tableScroll') TableScroll: ElementRef;
  @Input()
  PageTitle = '';
  @Input()
  service: BaseTableService<any> = {} as BaseTableService<any>;
  @Input()
  btnURL?: string;
  @Input()
  showResetPassword = false;
  @Input()
  validExportData = true;
  @Input()
  NoDialog = false;
  @Input()
  isReports = false;
  @Input()
  isDuplicateOption = false;

  @Input()
  columns: { header: string; field: string, type?: string ,width?:number}[] = [];
  @Output() openDialog: EventEmitter<{ isEdit: boolean; isShow: boolean; isDuplicate: boolean; item: T }> = new EventEmitter();
  @Output() deleteEventEmitter: EventEmitter<any> = new EventEmitter();
  @Output() resetPasswordEventEmitter: EventEmitter<any> = new EventEmitter();
  @Output() getReport: EventEmitter<{ getReport: boolean; }> = new EventEmitter();


  dataSource = [] as T[];
  paginator: PaginatorState = {} as PaginatorState;
  sorting: SortState = {} as SortState;
  grouping: GroupingState = {} as GroupingState;
  isLoading?: boolean;
  isReportLoading?: boolean;
  filterGroup: FormGroup = {} as FormGroup;
  searchGroup: FormGroup = {} as FormGroup;
  private subscriptions: Subscription[] = [];
  activeCol?: string;

  get serviceIsNotEmpty(): boolean {
    return this.service && Object.keys(this.service).length > 0;
  }

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {

    if (this.serviceIsNotEmpty) {
      this.service.fetch();
      this.grouping = this.service.grouping;
      this.paginator = this.service.paginator;
      this.sorting = this.service.sorting;

      const sb = this.service.isLoading$.subscribe(
        (res: boolean | undefined) => (this.isLoading = res)
      );
 
      this.columns = this.service.getTableHeaderAndFields();
      // this.service.items$.subscribe(res=>console.log(res))
    }
  }
  View(item: T) {
    this.openDialog.emit({ isEdit: false, isDuplicate: false, isShow: true, item });
  }
  // sorting
  sort(column: string) {

    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.activeCol = column;
    this.service.patchState({ sorting }, true);
  }



  // pagination
  paginate(paginator: PaginatorState) {
    this.sorting.column = null!
    this.service.patchState({ paginator });
  }

  ngOnDestroy() {
    this.service.setDefaults()
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  search(searchTerm: string) {
    this.service.patchState({ searchTerm });
  }
  ExtractReport() {
    this.getReport.emit({ getReport: true });

  }
  invalidExportData(): boolean {
    return this.validExportData
  }
  updateStatusForSelected() { }

  // actions
  // these will run for all dynamic modules
  deleteItem(id: number) {
    const modalRef = this.modalService.open(DynamicDialogComponent);
    modalRef.componentInstance.id = id;
    this.setDefaultValues(modalRef);
    modalRef.result.then(
      () => this.service.fetch(),
      () => { }
    );
  }


  // these will run for all dynamic modules
  deleteSelected() {
    const modalRef = this.modalService.open(DynamicDialogComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    this.setDefaultValues(modalRef);
    modalRef.result.then(
      () => this.service.fetch(),
      () => { }
    );
  }

  openAddEditDialog(isEdit = false, item: T): void {
    this.openDialog.emit({ isEdit, isDuplicate: false, isShow: false, item });
  }

  openDuplicateDialog(item: T): void {
    this.openDialog.emit({ isEdit: false, isShow: false, isDuplicate: true, item });
   }

  resetPassword(element: any): void {
    this.resetPasswordEventEmitter.emit(element);
  }

  private setDefaultValues(modalRef: any): void {
    modalRef.componentInstance.title = this.PageTitle;
    modalRef.componentInstance.service = this.service;
  }
}
