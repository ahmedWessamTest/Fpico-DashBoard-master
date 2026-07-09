import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IClients } from '../../../interfaces/dashboard/files-sections/IClients';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private _HttpClient: HttpClient) {}

  getAllClients(): Observable<IClients> {
    return this._HttpClient.get<IClients>(`${WEB_SITE_BASE_URL}client_index`);
  }

  addClients(EmployeeData: FormData): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}client_store`,
      EmployeeData
    );
  }

  updatClients(id: number, data: any): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}client_update/${id}`,
      data
    );
  }

  disableClients(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}partner_destroy/${id}`,
      {}
    );
  }

  enableClients(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}partner_enable/${id}`,
      {}
    );
  }
}
