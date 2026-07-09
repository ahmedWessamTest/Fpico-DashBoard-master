import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { IWhyUs } from '../../../../core/interfaces/dashboard/whyus/IWhyUs';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { IArrSystem } from '../../../../core/interfaces/dashboard/arr-system/IArrSystem';
import { ArrSystemsService } from '../../../../core/services/dashboard/content/arr-systems.service';
import { EditorModule } from 'primeng/editor';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-dashboard-aggreagation-systems',
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
    EditorModule,
    SafeHtmlPipe,
    DatePipe,
  ],
  templateUrl: './dashboard-aggreagation-systems.component.html',
  styleUrl: './dashboard-aggreagation-systems.component.scss',
  providers: [MessageService],
})
export class DashboardAggreagationSystemsComponent {
  arrSystem!: IArrSystem[];
  cols: any[] = [];
  selectedSection = {} as IArrSystem;
  sectionDialog: boolean = false;
  deleteSectionDialog: boolean = false;
  submitted: boolean = false;
  editorConfig = {
    toolbar: [['ul']],
    height: '200px',
  };
  constructor(
    private arrSystemsService: ArrSystemsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'en_title', header: 'English Title' },
      { field: 'ar_title', header: 'Arabic Title' },
      { field: 'active_status', header: 'Status' },
      { field: 'created_at', header: 'Created At' },
    ];
    this.loadSections();
  }

  // init cols

  // Load sections from API
  loadSections() {
    this.arrSystemsService.getAllArrSystmes().subscribe({
      next: (response) => {
        this.arrSystem = response.rows;
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
    // if (!this.selectedSection) return;
    console.log(this.selectedSection);
    this.selectedSection = {
      ...this.selectedSection,
      active_status: this.selectedSection.active_status || 1,
    };

    if (this.selectedSection.id) {
      this.arrSystemsService
        .updateArrSystmes(this.selectedSection.id, this.selectedSection)
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
      this.arrSystemsService.addArrSystmes(this.selectedSection).subscribe({
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
    this.arrSystemsService
      .disableArrSystmes(this.selectedSection.id)
      .subscribe({
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
  toggleStatus(section: any) {
    if (section.active_status === 0) {
      this.arrSystemsService.disableArrSystmes(section.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Status Updated Successfully!',
          });
        },
      });
    } else {
      this.arrSystemsService.enableArrSystmes(section.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Status Updated Successfully!',
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
