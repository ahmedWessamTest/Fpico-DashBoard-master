import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class WhyUsService {
  constructor(private _HttpClient: HttpClient) {}

  getAllWhyUsSection(): Observable<any> {
    return this._HttpClient.get<any>(`${WEB_SITE_BASE_URL}why_us_index`);
  }

  addWhyUsSection(writer: {}): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}why_us_store`,
      writer
    );
  }

  updateWhyUsSection(id: number, data: {}): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}why_us_update/${id}`,
      data
    );
  }

  disableWhyUsSection(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}why_us_destroy/${id}`,
      {}
    );
  }

  enableWhyUsSection(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}why_us_enable/${id}`,
      {}
    );
  }
}
