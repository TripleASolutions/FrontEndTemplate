import { ResponseData } from './../models/response-data.model';
// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState } from '../models/base.table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';

const DEFAULT_STATE: ITableState<any> = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
  item: {},
};
@Injectable({ providedIn: 'root' })
export abstract class BaseTableService<T> {
  // Private fields
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  protected _items$ = new BehaviorSubject<T[]>([]);
  protected _isLoading$ = new BehaviorSubject<boolean>(false);
  protected _tableState$ = new BehaviorSubject<ITableState<T>>(DEFAULT_STATE);
  protected _errorMessage = new BehaviorSubject<string>('');
  protected _subscriptions: Subscription[] = [];
  protected data: T[] = [];
  // Getters
  public get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  protected http: HttpClient;
  // API URL has to be override
  API_URL = environment.apiUrl;
  controller = '';
  Api = '';
  customFetchApi = 'GetAll';

  constructor(http: HttpClient) {
    this.http = http;
  }

  // CREATE
  // server should return the object with ID
  create(item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');

    const url = `${this.API_URL}/${this.controller}/Insert`;
    return this.http.post<BaseModel>(url, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => {
        this._isLoading$.next(false);
        this.fetch();
      })
    );
  }

  // READ (Returning filtered list of entities)
  find(tableState: ITableState<T>): Observable<ResponseData<T[]>> {
    let url = `${this.API_URL}/${this.controller}/${this.customFetchApi}?PageIndex=${tableState.paginator.page - 1
      }&PageSize=${tableState.paginator.pageSize}`;
    return this.findByUrl(url, tableState);
  }
  protected findByUrl(url: string, tableState: ITableState<T>) {
    this._errorMessage.next('');
    return this.http.post<ResponseData<T[]>>(url, tableState.item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ data: [], totalRecords: 0 } as ResponseData<T[]>);
      })
    );
  }

  getItemById(id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${this.controller}/GetById/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  getById(obj: T, idField = 'id'): Observable<ResponseData<T>> {
    const item = (obj as any)[idField];
    return this.http.get<ResponseData<T>>(`${this.controller}/GetById/${item}`);
  }
  // UPDATE
  update(item: BaseModel): Observable<any> {
    const url = `${this.API_URL}/${this.controller}/Update`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post(url, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of(item);
      }),
      finalize(() => {
        this._isLoading$.next(false);
        this.fetch();

      })
    );
  }

  // UPDATE Status
  updateStatusForItems(ids: number[], status: number): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL + '/updateStatus';
    return this.http.put(url, body).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${this.controller}/Delete/${id}`;
    return this.http.delete(url).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItems(ids: number[] = []): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${this.controller}/deleteItems`;
    return this.http.post(url, ids).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('DELETE SELECTED ITEMS', ids, err);
        return of([]);
      }),
      finalize(() => {
        this._isLoading$.next(false);
        this.fetch();
      })
    );
  }

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: any) => {
          this.data = res;
          this._items$.next(res);
          const totalRecords = res.totalRecords;
          this.patchStateWithoutFetch({
            paginator:
              this._tableState$.value.paginator.recalculatePaginator(
                totalRecords
              ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = el as unknown as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public setDefaults() {
    this._tableState$.value.item = {} as T
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState(),
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState<T>>, sort = false) {
    this.patchStateWithoutFetch(patch);
    if (!sort) {

      this.fetch();
    } else {
      this.sort();
    }
  }
  sort() {
    const sorting = this.sorting;
    this.data.sort((fItem: any, sItem: any) => {
      var left;
      var right;
      if (fItem[sorting.column] === 'null') {
        fItem[sorting.column] = '0';
      }
      if (sItem[sorting.column] === 'null') {
        sItem[sorting.column] = '0';
      }
      if (typeof fItem[sorting.column] === 'boolean') {
        left = fItem[sorting.column] ? '1' : '0';
      }
      else if (typeof fItem[sorting.column] === 'number') {
        left = fItem[sorting.column].toString();
      } else {
        left = fItem[sorting.column].toLocaleLowerCase();
      }
      if (typeof sItem[sorting.column] === 'boolean') {
        right = sItem[sorting.column] ? '1' : '0';
      } else if (typeof sItem[sorting.column] === 'number') {
        right = sItem[sorting.column].toString();
      } else {
        right = sItem[sorting.column].toLocaleLowerCase();
      }

      return this.handleSort(sorting.direction, this.sorting.column, left, right)

    });
    this._items$.next(this.data);
  }
  private handleSort(dir: string, sortCol: string, left: string, right: string) {

    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;
    const aA = left.replace(reA, '');
    const bA = right.replace(reA, '');
    if (sortCol === 'updatedAt') {
      left > right ? (dir === SortType.desc ? 1 : -1) :
        (left < right ? (dir === SortType.desc ? -1 : 1)
          : 0)
    }
    if (aA === bA) {
      const aN = +(left.replace(reN, ''));
      const bN = +(right.replace(reN, ''));
      return aN === bN ? 0 :
        (aN > bN) ?
          (dir === SortType.desc ? 1 : -1) : (dir === SortType.desc ? -1 : 1);
    } else {
      return aA > bA ? (dir === SortType.desc ? 1 : -1) : (dir === SortType.desc ? -1 : 1);
    }

  }
  public patchStateWithoutFetch(patch: Partial<ITableState<T>>) {

    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }
  public patchFilter(filter: any) {
    this._tableState$.value.item = filter;

    this.fetch();
  }

  getTableHeaderAndFields(): {
    header: string;
    field: string;
    type?: string;
  }[] {
    return [];
  }

  insert(item: T): Observable<T> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${this.controller}/Insert`;
    return this.http.post<T>(url, item).pipe(
      finalize(() => {
        this.fetch();
        this._isLoading$.next(false);
      })
    );
  }
}

export enum SortType {
  desc = "desc",
  asc = "asc"
}
