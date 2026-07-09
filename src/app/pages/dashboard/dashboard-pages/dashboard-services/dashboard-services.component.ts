import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxJoditComponent } from 'ngx-jodit';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { WEB_SITE_BASE_URL_IMAGE } from '../../../../core/constants/WEB_SITE_BASE_UTL';
import { IProject } from '../../../../core/interfaces/dashboard/files-sections/IProjects';
import { IService } from '../../../../core/interfaces/dashboard/files-sections/IServices';
import { FpicoServicesService } from '../../../../core/services/dashboard/content/fpico-services.service';
import { ProjectGalleryService } from '../../../../core/services/dashboard/content/project-gallery.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-dashboard-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    InputSwitchModule,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
    NgxJoditComponent,
    NgxSpinnerModule,
    RouterLink,
  ],
  templateUrl: './dashboard-services.component.html',
  styleUrl: './dashboard-services.component.scss',
  providers: [MessageService],
})
export class DashboardServicesComponent {
  projects!: IService[];
  cols: any[] = [];
  WEB_SITE_BASE_URL = WEB_SITE_BASE_URL_IMAGE;
  constructor(
    private fpicoServicesService: FpicoServicesService,
    private messageService: MessageService,
    private projectGalleryService: ProjectGalleryService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'main_image', header: 'Image' },
      { field: 'en_service_title', header: 'English Title' },
      { field: 'ar_service_title', header: 'Arabic Title' },
      { field: 'service_type', header: 'Service Type' },
      { field: 'active_status', header: 'Status' },
      { field: 'home_status', header: 'Home' },
    ];

    this.loadProjects();
  }

  // Load projects from API
  loadProjects() {
    this.fpicoServicesService.getAllServices().subscribe({
      next: (response) => {
        this.projects = response.rows;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Please Check Your Internet Connection',
        }),
    });
  }



  // Toggle Project Active Status
  toggleStatus(project: IService) {
    console.log(project);
    if (project.active_status == 0) {
      this.fpicoServicesService.disableServices(project.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project activated successfully',
          });
          // this.loadProjects();
        },
      });
    } else {
      this.fpicoServicesService.enableServices(project.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project deactivated successfully',
          });
          // this.loadProjects();
        },
      });
    }
  }

  toggleHomeStatus(project: IService) {
    project.home_status = project.home_status == 0 ? 0 : 1; // Toggle value

    const formData = new FormData();
    formData.append('home_status', project.home_status.toString());

    this.fpicoServicesService.updateServices(project.id, formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Home status updated successfully',
        });
        // this.loadProjects(); // Reload data to reflect changes
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating home status',
        });
      },
    });
  }


  selectedProjectImages: any[] = []; // Stores images of the selected project
  galleryDialog: boolean = false; // Controls the visibility of the image management dialog
  selectedProjectId!: number; // Stores the currently selected project's ID

  openGalleryDialog(project: IProject) {
    this.selectedProjectId = project.id;
    this.projectGalleryService.getSpecificProject(project.id).subscribe({
      next: (response: any) => {
        this.selectedProjectImages = response.row.images;
        this.galleryDialog = true;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load images',
        });
      },
    });
  }
  onUploadImage(event: any) {
    if (event.target.files.length > 0) {
      this._NgxSpinnerService.show('loaderGallery'); // Show loader

      const files = event.target.files;
      let uploadedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('main_image', file, file.name);

        this.projectGalleryService
          .getUploadGalleryImage(this.selectedProjectId, formData)
          .subscribe({
            next: () => {
              uploadedCount++;

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Image ${file.name} uploaded successfully`,
              });

              // Refresh images only after the last upload
              if (uploadedCount === files.length) {
                this.openGalleryDialog({
                  id: this.selectedProjectId,
                } as IProject);
                this._NgxSpinnerService.hide('loaderGallery'); // Hide loader
              }
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to upload image ${file.name}`,
              });

              // Hide loader if all uploads (including failed ones) are processed
              uploadedCount++;
              if (uploadedCount === files.length) {
                this._NgxSpinnerService.hide('loaderGallery');
              }
            },
          });
      }
    }
  }

  toggleImageStatus(imageId: number) {
    this.projectGalleryService.toggleGalleryImage(imageId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image status updated',
        });
        this.openGalleryDialog({ id: this.selectedProjectId } as IProject); // Refresh images
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update image status',
        });
      },
    });
  }
  onUpdateImage(imageId: number, event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('main_image', file, file.name);

      this.projectGalleryService
        .updateGalleryImage(imageId, formData)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Image updated successfully',
            });
            this.openGalleryDialog({ id: this.selectedProjectId } as IProject); // Refresh images
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update image',
            });
          },
        });
    }
  }
}
