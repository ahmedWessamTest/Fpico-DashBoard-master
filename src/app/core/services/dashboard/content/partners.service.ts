import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { IPartners } from '../../../interfaces/dashboard/files-sections/IPartners';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  constructor(private _HttpClient: HttpClient) {}

  getAllPartners(): Observable<IPartners> {
    return this._HttpClient.get<IPartners>(`${WEB_SITE_BASE_URL}partner_index`);
  }

  addPartners(EmployeeData: FormData): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}partner_store`,
      EmployeeData
    );
  }

  updatPartners(id: number, data: any): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}partner_update/${id}`,
      data
    );
  }

  disablePartners(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}partner_destroy/${id}`,
      {}
    );
  }

  enablePartners(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}partner_enable/${id}`,
      {}
    );
  }
}
