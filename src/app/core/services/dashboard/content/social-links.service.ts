import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WEB_SITE_BASE_URL } from "../../../constants/WEB_SITE_BASE_UTL";
import { IContactUs, IUpdateSocialLinks } from "../../../interfaces/dashboard/contact-us/IContactUs";

@Injectable({
  providedIn: "root",
})
export class SocialLinksService {
  constructor(private _HttpClient: HttpClient) {}

  getSocialMediaLinks(): Observable<IContactUs> {
    return this._HttpClient.get<IContactUs>(`${WEB_SITE_BASE_URL}contactinfoindex`);
  }

  updateSocialMediaLinks(socialMedia: {}): Observable<any> {
    return this._HttpClient.post<any>(`${WEB_SITE_BASE_URL}contactinfoupdate/1`, socialMedia);
  }
}
