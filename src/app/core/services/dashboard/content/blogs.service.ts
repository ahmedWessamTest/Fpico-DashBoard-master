import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WEB_SITE_BASE_URL } from "../../../constants/WEB_SITE_BASE_UTL";
import { IGetAllBlogs } from "../../../interfaces/dashboard/blogs/IGetAllBlogs";
import { IToggleBlogsResponse } from "../../../interfaces/dashboard/blogs/IToggleBlogsResponse";
import { IGetBlogById } from "../../../interfaces/dashboard/blogs/IGetBlogById";

@Injectable({
  providedIn: "root",
})
export class BlogsService {
  constructor(private _HttpClient: HttpClient) { }

  getAllBlogs(pageNum: number = 1, perPage: number = 10, search: string = '') {
    let url = `${WEB_SITE_BASE_URL}blog_index?page=${pageNum}&limits=${perPage}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return <Observable<IGetAllBlogs>>(
      this._HttpClient.get(url)
    );
  }

  addBlog(data: FormData): Observable<any> {
    return <Observable<any>>this._HttpClient.post(`${WEB_SITE_BASE_URL}blog_store`, data);
  }

  updateBlog(id: number, data: FormData): Observable<any> {
    return <Observable<any>>this._HttpClient.post(`${WEB_SITE_BASE_URL}blog_update/${id}`, data);
  }

  blogsEnable(id: number) {
    return this._HttpClient.post<IToggleBlogsResponse>(`${WEB_SITE_BASE_URL}blog_enable/${id}`, {});
  }

  blogsDisable(id: number) {
    return this._HttpClient.post<IToggleBlogsResponse>(`${WEB_SITE_BASE_URL}blog_destroy/${id}`, {});
  }

  getBlogById(id: string) {
    return this._HttpClient.get<IGetBlogById>(`${WEB_SITE_BASE_URL}blog_data/${id}`);
  }

  updateSlugToAr(data: { from: number[]; to: string }[]): Observable<any> {
    return this._HttpClient.post<any>(`${WEB_SITE_BASE_URL}updateSlugToAr`, data);
  }

  deleteImage(src: string, folder: string = 'blogs'): Observable<any> {
    return this._HttpClient.post<any>(`${WEB_SITE_BASE_URL}deleteImage`, { image_name: src, folder });
  }
}

