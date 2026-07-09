import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import {
  IArrSystem,
  IArrSystems,
} from '../../../interfaces/dashboard/arr-system/IArrSystem';

@Injectable({
  providedIn: 'root',
})
export class ArrSystemsService {
  constructor(private _HttpClient: HttpClient) {}

  getAllArrSystmes(): Observable<IArrSystems> {
    return this._HttpClient.get<IArrSystems>(
      `${WEB_SITE_BASE_URL}arregation_index`
    );
  }

  addArrSystmes(writer: {}): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}arregation_store`,
      writer
    );
  }

  updateArrSystmes(id: number, data: {}): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}arregation_update/${id}`,
      data
    );
  }

  disableArrSystmes(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}arregation_destroy/${id}`,
      {}
    );
  }

  enableArrSystmes(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}arregation_enable/${id}`,
      {}
    );
  }
}
