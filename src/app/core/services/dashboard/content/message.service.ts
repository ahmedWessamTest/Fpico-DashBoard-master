import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import {
  IMasterMessageUpdate,
  IMessageMaster,
} from '../../../interfaces/dashboard/message/IMessageMaster';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private _HttpClient: HttpClient) {}

  getMasterMessage(): Observable<IMessageMaster> {
    return this._HttpClient.get<IMessageMaster>(
      `${WEB_SITE_BASE_URL}chairmessageindex`
    );
  }

  updateMasterMessage(newMessage: {}): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}chairmessageupdate/1`,
      newMessage
    );
  }
}
