import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { IAboutUs } from '../../../interfaces/dashboard/about-us/IAbouUs';

@Injectable({
  providedIn: 'root',
})
export class AboutUsService {
  constructor(private _HttpClient: HttpClient) {}

  getAboutUs(): Observable<IAboutUs> {
    return this._HttpClient.get<IAboutUs>(`${WEB_SITE_BASE_URL}aboutindex`);
  }

  updateAboutUs(data: any): Observable<IAboutUs> {
    return this._HttpClient.post<IAboutUs>(
      `${WEB_SITE_BASE_URL}aboutupdate/1`,
      data
    );
  }
}
