import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { WEB_SITE_BASE_URL_IMAGE } from '../../../../core/constants/WEB_SITE_BASE_UTL';
import { IFeature } from '../../../../core/interfaces/dashboard/features/IFeatures';
import { FeaturesService } from '../../../../core/services/dashboard/content/features.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-dashboard-features',
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
    DatePipe,
  ],
  templateUrl: './dashboard-features.component.html',
  styleUrl: './dashboard-features.component.scss',
  providers: [MessageService],
})
export class DashboardFeaturesComponent {
  features!: IFeature[];
  cols: any[] = [];
  selectedPartner: IFeature = {} as IFeature;
  partnerDialog: boolean = false;
  submitted: boolean = false;
  selectedImage: File | null = null;
  WEB_SITE_BASE_URL = WEB_SITE_BASE_URL_IMAGE;
  constructor(
    private featuresService: FeaturesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'icon_image', header: 'image' },
      { field: 'en_title', header: 'en title' },
      { field: 'ar_title', header: 'ar title' },
      { field: 'active_status', header: 'status' },
      { field: 'created_at', header: 'created at' },
    ];
    this.loadEmployees();
  }

  // Load employees from API
  loadEmployees() {
    this.featuresService.getAllFeature().subscribe({
      next: (response) => {
        this.features = response.rows;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Please Check Your Internet Connection',
        }),
    });
  }

  // Open add employee dialog
  openAddPartnerDialog() {
    this.selectedPartner = {} as IFeature;
    this.submitted = false;
    this.selectedImage = null; // Reset image
    this.partnerDialog = true;
  }

  // Save employee (Add or Update)
  savePartner() {
    this.submitted = true;

    // Validate required fields
    if (
      !this.selectedPartner.icon_image ||
      !this.selectedPartner.en_title ||
      !this.selectedPartner.ar_title ||
      !this.selectedPartner.en_text ||
      !this.selectedPartner.ar_text
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields before saving.',
      });
      return; // Stop execution if form is invalid
    }

    let selectedPartner = {
      ...this.selectedPartner,
      active_status: 1,
    };

    if (this.selectedPartner.id) {
      // Prepare the form data for update (without image if not selected)
      const formData = new FormData();
      formData.append('en_title', selectedPartner.en_title);
      formData.append('ar_title', selectedPartner.ar_title);
      formData.append('en_text', selectedPartner.en_text);
      formData.append('ar_text', selectedPartner.ar_text);
      formData.append(
        'active_status',
        this.selectedPartner.active_status.toString()
      );

      if (this.selectedImage) {
        formData.append(
          'icon_image',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      // Send update request with or without image
      this.featuresService
        .updatFeature(this.selectedPartner.id, formData)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: 'project updated successfully',
            });
            this.loadEmployees();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Please Check Your Internet Connection',
            }),
        });
    } else {
      // Prepare form data for adding employee (with image if selected)
      const formData = new FormData();
      formData.append('en_title', this.selectedPartner.en_title);
      formData.append('ar_title', this.selectedPartner.ar_title);
      formData.append('en_text', this.selectedPartner.en_text);
      formData.append('ar_text', this.selectedPartner.ar_text);
      formData.append('status', '1');

      if (this.selectedImage) {
        formData.append(
          'icon_image',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      this.featuresService.addFeature(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'project added successfully',
          });
          this.loadEmployees();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Please Check Your Internet Connection',
          }),
      });
    }

    this.partnerDialog = false;
    this.selectedPartner = {} as IFeature;
    this.selectedImage = null; // Reset image selection
  }

  // Toggle employee status
  toggleStatus(employee: IFeature) {
    if (employee.active_status === 0) {
      this.featuresService.disableFeature(employee.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'project updated successfully',
          });
        },
      });
    } else {
      this.featuresService.enableFeature(employee.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'project updated successfully',
          });
        },
      });
    }
  }

  openEditPartnerDialog(employee: IFeature) {
    this.selectedPartner = { ...employee };
    this.partnerDialog = true;
  }

  // Hide dialog
  hideDialog() {
    this.partnerDialog = false;
    this.submitted = false;
  }
  // Handle image file selection
  onFileSelect(event: any) {
    this.selectedImage = event.target.files[0];
  }
}
