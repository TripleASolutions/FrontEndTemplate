import { Injectable } from '@angular/core';
import { IsNullOrEmptyString } from '../../helper/helper';
import { EncrDecrService } from '../encryption-decryption.service';

/** This service for handling local-storage variable
 * as encrapted and decrpted
 */
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  // tslint:disable-next-line: variable-name
  private readonly _token = 'to___k';
  private readonly _userName = 'u____n';
  private readonly _userId = 'u____D';
  private readonly _userData = 'u____I';
  private readonly _email = 'u____E';


  constructor(private encrDecrService: EncrDecrService) { }

  setToken(value: string): void {
    this.setValue(this._token, value);
  }

  getToken(): string {
    return this.getValue(this._token);
  }

  setUserName(value: string): void {
    this.setValue(this._userName, value);
  }
  setEmail(value: string): void {
    this.setValue(this._email, value);
  }
  setUserId(value: string): void {
    this.setValue(this._userId, value);
  }
  setUserData(value: any): void {
    this.setValue(this._userData, value);
  }

  getUserName(): string {
    return this.getValue(this._userName);
  }

  getUserData(): string {
    return this.getValue(this._userData);

  }
  getUserEmail(): string {
    return this.getValue(this._email);

  }
  clearAll(): void {
    localStorage.clear();
  }

  private setValue(key: string, value: string): void {
    switch (key) {
      case this._token:
        this.setlocalValue(this._token, value);
        break;
      case this._userName:
        this.setlocalValue(this._userName, value);
        break;
      case this._userData:
        this.setlocalValue(this._userData, value);
        break;
      case this._email:
        this.setlocalValue(this._email, value);
        break;
      default:
        break;
    }
  }

  private setlocalValue(key: string, value: string): void {
    if (!IsNullOrEmptyString(value)) {
      const encrpty = this.encrDecrService.set(value);
      localStorage.setItem(key, encrpty);
    }
  }

  private getValue(key: string): any {
    const val = localStorage.getItem(key);

    if (val && !IsNullOrEmptyString(val)) {
      return this.encrDecrService.get(val);
    }

    return '';
  }
}
