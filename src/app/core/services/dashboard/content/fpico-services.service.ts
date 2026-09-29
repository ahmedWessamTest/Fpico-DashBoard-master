import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { HttpClient } from '@angular/common/http';
import { IServices } from '../../../interfaces/dashboard/files-sections/IServices';

@Injectable({
  providedIn: 'root',
})
export class FpicoServicesService {
  constructor(private _HttpClient: HttpClient) {}

  getAllServices(): Observable<IServices> {
    return this._HttpClient.get<IServices>(`${WEB_SITE_BASE_URL}service_index`);
  }

  addServices(EmployeeData: FormData): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}service_store`,
      EmployeeData
    );
  }

  updateServices(id: number, data: any): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}service_update/${id}`,
      data
    );
  }

  disableServices(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}service_destroy/${id}`,
      {}
    );
  }

  enableServices(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}service_enable/${id}`,
      {}
    );
  }

  toggleNavStatus(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}service_toggle_nav/${id}`,
      {}
    );
  }
}
