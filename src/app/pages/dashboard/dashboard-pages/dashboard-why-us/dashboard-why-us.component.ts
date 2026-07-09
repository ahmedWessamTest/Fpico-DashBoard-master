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
import { IWhyUs } from '../../../../core/interfaces/dashboard/whyus/IWhyUs';
import { WhyUsService } from '../../../../core/services/dashboard/content/why-us.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-dashboard-why-us',
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
  templateUrl: './dashboard-why-us.component.html',
  styleUrl: './dashboard-why-us.component.scss',
  providers: [MessageService],
})
export class DashboardWhyUsComponent {
  whyUsSections!: IWhyUs[];
  cols: any[] = [];
  selectedSection = {} as any;
  sectionDialog: boolean = false;
  deleteSectionDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private whyUsService: WhyUsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'why_us_number', header: 'Name' },
      { field: 'en_why_us_title', header: 'en title' },
      { field: 'ar_why_us_title', header: 'Status' },
      { field: 'created_at', header: 'created At' },
    ];
    this.loadSections();
  }

  // init cols

  // Load sections from API
  loadSections() {
    this.whyUsService.getAllWhyUsSection().subscribe({
      next: (response) => {
        this.whyUsSections = response.rows;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Please Check Your Internet Connection',
        }),
    });
  }

  // Open add writer dialog
  openAddSectionDialog() {
    this.selectedSection = {} as any;
    this.submitted = false;
    this.sectionDialog = true;
  }

  // Save writer (Add or Update)
  saveSection() {
    this.submitted = true;

    // Validate required fields
    if (
      !this.selectedSection.en_why_us_title ||
      !this.selectedSection.ar_why_us_title ||
      !this.selectedSection.en_why_us_text ||
      !this.selectedSection.ar_why_us_text
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields before saving.',
      });
      return; // Stop execution if form is invalid
    }

    // if (!this.selectedSection) return;
    console.log(this.selectedSection);
    let section = {
      ...this.selectedSection,
      active_status: this.selectedSection.writer_status || '1',
    };

    if (this.selectedSection.id) {
      this.whyUsService
        .updateWhyUsSection(this.selectedSection.id, this.selectedSection)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Writer Updated Successfully!',
            });
            this.sectionDialog = false; // Move inside success
            this.loadSections();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Please Check Your Internet Connection',
            }),
        });
    } else {
      this.whyUsService.addWhyUsSection(this.selectedSection).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Writer Added Successfully!',
          });
          this.sectionDialog = false; // Move inside success
          this.loadSections();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please Check Your Internet Connection',
          }),
      });
    }
  }

  // Delete writer
  deleteWriter(writer: any) {
    this.selectedSection = writer;
    this.deleteSectionDialog = true;
  }

  confirmDeleteSection() {
    this.whyUsService.disableWhyUsSection(this.selectedSection.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Writer Updated Successfully!',
        });
        this.loadSections();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please Check Your Internet Connection',
        }),
    });

    this.deleteSectionDialog = false;
  }

  // Toggle writer status
  toggleStatus(writer: any) {
    if (parseInt(writer.writer_status) == 0) {
      {
        this.whyUsService.enableWhyUsSection(writer.id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Writer Updated Successfully!',
            });
          },
        });
      }
    } else {
      this.whyUsService.disableWhyUsSection(writer.id).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Writer Updated Successfully!',
          });
        },
      });
    }
  }

  openEditSectionDialog(writer: any) {
    this.selectedSection = { ...writer };
    this.sectionDialog = true;
  }

  // Hide dialog
  hideDialog() {
    this.sectionDialog = false;
    this.submitted = false;
  }
}
