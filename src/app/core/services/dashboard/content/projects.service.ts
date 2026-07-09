import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPartner,
  IPartners,
} from '../../../interfaces/dashboard/files-sections/IPartners';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { IProjects } from '../../../interfaces/dashboard/files-sections/IProjects';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private _HttpClient: HttpClient) {}

  getAllProjects(): Observable<IProjects> {
    return this._HttpClient.get<IProjects>(`${WEB_SITE_BASE_URL}project_index`);
  }

  addProject(EmployeeData: FormData): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}project_store`,
      EmployeeData
    );
  }

  updateProject(id: number, data: any): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}project_update/${id}`,
      data
    );
  }

  disableProject(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}service_destroy/${id}`,
      {}
    );
  }

  enableProject(id: number): Observable<any> {
    return this._HttpClient.post<any>(
      `${WEB_SITE_BASE_URL}service_enable/${id}`,
      {}
    );
  }
}
