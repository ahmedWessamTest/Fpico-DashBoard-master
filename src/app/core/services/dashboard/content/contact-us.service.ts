import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { IContactUsMessages } from '../../../interfaces/dashboard/contact-us/IContactUsMessages';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private _HttpClient: HttpClient) {}

  // submitUserForm(userFormData: {}): Observable<IContactUs> {
  //   return this._HttpClient.post<IContactUs>(
  //     `${WEB_SITE_BASE_URL}submitContactForm`,
  //     userFormData
  //   );
  // }

  getContactUs(): Observable<IContactUsMessages> {
    return this._HttpClient.get<IContactUsMessages>(
      `${WEB_SITE_BASE_URL}feedback_index`
    );
  }
}
