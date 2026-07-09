import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class ProjectGalleryService {
  constructor(private http: HttpClient) {}

  getSpecificProject(id: number) {
    return this.http.get(`${WEB_SITE_BASE_URL}service_data/${id}`);
  }
  getUploadGalleryImage(id: number, image: {}) {
    return this.http.post(
      `${WEB_SITE_BASE_URL}uploadserviceimages/${id}`,
      image
    );
  }

  toggleGalleryImage(id: number) {
    return this.http.post(`${WEB_SITE_BASE_URL}disableserviceimage/${id}`, {});
  }
  updateGalleryImage(id: number, image: {}) {
    return this.http.post(
      `${WEB_SITE_BASE_URL}updateserviceimage/${id}`,
      image
    );
  }
}
