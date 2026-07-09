import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ILogInResponse,
  IUserData,
  loginErrorMessage,
} from '../interfaces/ILoninResponse';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(userData: IUserData): Observable<ILogInResponse | loginErrorMessage> {
    return this.http.post<ILogInResponse | loginErrorMessage>(
      `${WEB_SITE_BASE_URL}signin`,
      userData
    );
  }
}
