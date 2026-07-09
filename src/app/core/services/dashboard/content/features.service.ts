import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { IFeatures } from '../../../interfaces/dashboard/features/IFeatures';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  constructor(private _HttpClient: HttpClient) {}

  getAllFeature(): Observable<IFeatures> {
    return this._HttpClient.get<IFeatures>(`${WEB_SITE_BASE_URL}feature_index`);
  }

  addFeature(EmployeeData: FormData): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}feature_store`,
      EmployeeData
    );
  }

  updatFeature(id: number, data: any): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}feature_update/${id}`,
      data
    );
  }

  disableFeature(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}feature_destroy/${id}`,
      {}
    );
  }

  enableFeature(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}feature_enable/${id}`,
      {}
    );
  }
}
