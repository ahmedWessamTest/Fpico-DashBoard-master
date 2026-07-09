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
import { IClient } from '../../../../core/interfaces/dashboard/files-sections/IClients';
import { ClientsService } from '../../../../core/services/dashboard/content/clients.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-dashboard-clients',
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
  templateUrl: './dashboard-clients.component.html',
  styleUrl: './dashboard-clients.component.scss',
  providers: [MessageService],
})
export class DashboardClientsComponent {
  clients!: IClient[];
  cols: any[] = [];
  selectedPartner: IClient = {} as IClient;
  partnerDialog: boolean = false;
  submitted: boolean = false;
  selectedImage: File | null = null;
  WEB_SITE_BASE_URL = WEB_SITE_BASE_URL_IMAGE;
  constructor(
    private clientsService: ClientsService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'main_image', header: 'image' },
      { field: 'en_partner_title', header: 'en title' },
      { field: 'ar_partner_title', header: 'ar title' },
      { field: 'active_status', header: 'status' },
      { field: 'created_at', header: 'created at' },
    ];
    this.loadEmployees();
  }

  // Load employees from API
  loadEmployees() {
    this.clientsService.getAllClients().subscribe({
      next: (response) => {
        this.clients = response.rows;
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
    this.selectedPartner = {} as IClient;
    this.submitted = false;
    this.selectedImage = null; // Reset image
    this.partnerDialog = true;
  }

  // Save employee (Add or Update)
  savePartner() {
    this.submitted = true;

    // Ensure that name and title are provided
    // if (!this.selectedPartner || !this.selectedPartner.title) return;

    let selectedPartner = {
      ...this.selectedPartner,
      active_status: 1,
    };

    if (this.selectedPartner.id) {
      // Prepare the form data for update (without image if not selected)
      const formData = new FormData();
      formData.append('en_partner_title', selectedPartner.en_partner_title);
      formData.append('ar_partner_title', selectedPartner.ar_partner_title);
      formData.append('url_link', 'url_link');
      formData.append(
        'active_status',
        this.selectedPartner.active_status.toString()
      );

      if (this.selectedImage) {
        formData.append(
          'main_image',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      // Send update request with or without image
      this.clientsService
        .updatClients(this.selectedPartner.id, formData)
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
      formData.append(
        'en_partner_title',
        this.selectedPartner.en_partner_title
      );
      formData.append(
        'ar_partner_title',
        this.selectedPartner.ar_partner_title
      );
      formData.append('url_link', 'url_link');
      formData.append('active_status', '1');

      if (this.selectedImage) {
        formData.append(
          'main_image',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      this.clientsService.addClients(formData).subscribe({
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
    this.selectedPartner = {} as IClient;
    this.selectedImage = null; // Reset image selection
  }

  // Toggle employee status
  toggleStatus(employee: IClient) {
    if (employee.active_status === 0) {
      this.clientsService.disableClients(employee.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'project updated successfully',
          });
        },
      });
    } else {
      this.clientsService.enableClients(employee.id).subscribe({
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

  openEditPartnerDialog(employee: IClient) {
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
