import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { ProjectGalleryService } from '../../../../core/services/dashboard/content/project-gallery.service';
import { ProjectsService } from '../../../../core/services/dashboard/content/projects.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-dashboard-projects',
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
  ],
  templateUrl: './dashboard-projects.component.html',
  styleUrl: './dashboard-projects.component.scss',
  providers: [MessageService],
})
export class DashboardProjectsComponent {
  projects!: IProject[];
  cols: any[] = [];
  selectedProject: IProject = {} as IProject;
  projectDialog: boolean = false;
  submitted: boolean = false;
  selectedImage: File | null = null;
  WEB_SITE_BASE_URL = WEB_SITE_BASE_URL_IMAGE;
  constructor(
    private projectsService: ProjectsService,
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

    // this._NgxSpinnerService.show('loaderGallery');

    this.loadProjects();
  }

  // Load projects from API
  loadProjects() {
    this.projectsService.getAllProjects().subscribe({
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

  // Open Add Project Dialog
  openAddProjectDialog() {
    this.selectedProject = {
      id: 0,
      en_service_title: '',
      ar_service_title: '',
      en_service_text: '',
      ar_service_text: '',
      en_meta_title: '',
      ar_meta_title: '',
      en_meta_text: '',
      ar_meta_text: '',
      service_type: 'service',
      home_status: 0, // Explicitly set default
      active_status: 1, // Explicitly set default
      main_image: '',
    } as IProject;
    this.submitted = false;
    this.selectedImage = null; // Reset image
    this.projectDialog = true;
  }

  // Save Project (Add or Update)
  saveProject() {
    this.submitted = true;

    // Validate required fields
    if (
      !this.selectedProject.en_service_title ||
      !this.selectedProject.ar_service_title ||
      !this.selectedProject.en_service_text ||
      !this.selectedProject.ar_service_text ||
      !this.selectedProject.en_meta_title ||
      !this.selectedProject.ar_meta_title
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields before saving.',
      });
      return; // Stop execution if form is invalid
    }

    const formData = new FormData();
    formData.append('en_service_title', this.selectedProject.en_service_title);
    formData.append('ar_service_title', this.selectedProject.ar_service_title);
    formData.append(
      'en_service_text',
      this.selectedProject.en_service_text || ''
    );
    formData.append(
      'ar_service_text',
      this.selectedProject.ar_service_text || ''
    );
    formData.append('en_slug', this.selectedProject.en_slug || '');
    formData.append('ar_slug', this.selectedProject.ar_slug || '');
    formData.append('en_meta_title', this.selectedProject.en_meta_title || '');
    formData.append('ar_meta_title', this.selectedProject.ar_meta_title || '');
    formData.append('en_meta_text', this.selectedProject.en_meta_text || '');
    formData.append('ar_meta_text', this.selectedProject.ar_meta_text || '');
    formData.append(
      'service_type',
      this.selectedProject.service_type || 'service'
    );
    formData.append(
      'home_status',
      this.selectedProject.home_status.toString() || '0'
    );
    formData.append(
      'active_status',
      this.selectedProject.active_status.toString() || '1'
    );

    if (this.selectedImage) {
      formData.append(
        'main_image',
        this.selectedImage,
        this.selectedImage.name
      );
    }

    if (this.selectedProject.id) {
      // Update project
      this.projectsService
        .updateProject(this.selectedProject.id, formData)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Project updated successfully',
            });
            this.loadProjects();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error updating project',
            });
          },
        });
    } else {
      // Add project
      this.projectsService.addProject(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project added successfully',
          });
          this.loadProjects();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error adding project',
          });
        },
      });
    }

    this.projectDialog = false;
    this.selectedProject = {} as IProject;
    this.selectedImage = null;
  }

  // Toggle Project Active Status
  toggleStatus(project: IProject) {
    console.log(project);
    if (project.active_status == 0) {
      this.projectsService.disableProject(project.id).subscribe({
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
      this.projectsService.enableProject(project.id).subscribe({
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

  toggleHomeStatus(project: IProject) {
    project.home_status = project.home_status == 0 ? 0 : 1; // Toggle value

    const formData = new FormData();
    formData.append('home_status', project.home_status.toString());

    this.projectsService.updateProject(project.id, formData).subscribe({
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

  // Open Edit Project Dialog
  openEditProjectDialog(project: IProject) {
    this.selectedProject = { ...project };
    this.projectDialog = true;
  }

  // Hide Dialog
  hideDialog() {
    this.projectDialog = false;
    this.submitted = false;
  }

  // Handle Image Selection
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
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
