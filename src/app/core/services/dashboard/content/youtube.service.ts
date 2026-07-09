import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { IYoutube } from '../../../interfaces/dashboard/youtube/iyoutube';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  constructor(private _HttpClient: HttpClient) {}

  getAllYoutubeSection(): Observable<any> {
    return this._HttpClient.get<any>(`${WEB_SITE_BASE_URL}youtube_index`);
  }

  getYoutubeByIdSection(id: number): Observable<any> {
    return this._HttpClient.get<any>(`${WEB_SITE_BASE_URL}youtube_data/${id}`);
  }

  addYoutubeSection(youtube: IYoutube): Observable<any> {
    const formData = new FormData();
    formData.append('en_title', youtube.en_title);
    formData.append('ar_title', youtube.ar_title);
    formData.append('main_image', youtube.main_image);
    formData.append('main_url', youtube.main_url);
    formData.append('active_status', youtube.active_status.toString());

    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}youtube_store`,
      formData
    );
  }

  updateYoutubeSection(id: number, youtube: IYoutube): Observable<any> {
    const formData = new FormData();
    formData.append('en_title', youtube.en_title);
    formData.append('ar_title', youtube.ar_title);
    formData.append('main_image', youtube.main_image);
    formData.append('main_url', youtube.main_url);
    formData.append('active_status', youtube.active_status.toString());

    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}youtube_update/${id}`,
      formData
    );
  }

  disableYoutubeSection(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}youtube_destroy/${id}`,
      {}
    );
  }

  enableYoutubeSection(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}youtube_enable/${id}`,
      {}
    );
  }
}
