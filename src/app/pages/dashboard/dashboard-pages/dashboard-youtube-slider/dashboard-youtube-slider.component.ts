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
import { IYoutube } from '../../../../core/interfaces/dashboard/youtube/iyoutube';
import { YoutubeService } from '../../../../core/services/dashboard/content/youtube.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-dashboard-youtube-slider',
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
  templateUrl: './dashboard-youtube-slider.component.html',
  styleUrl: './dashboard-youtube-slider.component.scss',
  providers: [MessageService],
})
export class DashboardYoutubeSliderComponent {
  youtubeVideos!: IYoutube[];
  cols: any[] = [];
  selectedYoutube: IYoutube = {} as IYoutube;
  youtubeDialog: boolean = false;
  submitted: boolean = false;
  selectedImage: File | null = null;
  WEB_SITE_BASE_URL = WEB_SITE_BASE_URL_IMAGE;

  constructor(
    private youtubeService: YoutubeService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'main_image', header: 'Image' },
      { field: 'en_title', header: 'En Title' },
      { field: 'ar_title', header: 'Ar Title' },
      { field: 'main_url', header: 'YouTube URL' },
      { field: 'active_status', header: 'Status' },
      { field: 'created_at', header: 'Created At' },
    ];
    this.loadYoutubeVideos();
  }

  // Load YouTube videos from API
  loadYoutubeVideos() {
    this.youtubeService.getAllYoutubeSection().subscribe({
      next: (response) => {
        this.youtubeVideos = response.rows;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Please Check Your Internet Connection',
        }),
    });
  }

  // Open add YouTube dialog
  openAddYoutubeDialog() {
    this.selectedYoutube = {} as IYoutube;
    this.submitted = false;
    this.selectedImage = null; // Reset image
    this.youtubeDialog = true;
  }

  // Save YouTube (Add or Update)
  saveYoutube() {
    this.submitted = true;

    // Validate required fields
    if (
      !this.selectedYoutube.en_title ||
      !this.selectedYoutube.ar_title ||
      !this.selectedYoutube.main_url
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields before saving.',
      });
      return; // Stop execution if form is invalid
    }

    // Check if image is required (for new entries or when editing without existing image)
    if (!this.selectedYoutube.id && !this.selectedImage) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please select a thumbnail image.',
      });
      return;
    }

    let selectedYoutube: IYoutube = {
      ...this.selectedYoutube,
      active_status: 1,
    };

    if (this.selectedYoutube.id) {
      // Update existing YouTube video
      // Set the image property to the selected file or keep existing
      if (this.selectedImage) {
        selectedYoutube.main_image = this.selectedImage as any;
      }

      this.youtubeService
        .updateYoutubeSection(this.selectedYoutube.id, selectedYoutube)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'YouTube video updated successfully',
            });
            this.loadYoutubeVideos();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Please Check Your Internet Connection',
            }),
        });
    } else {
      // Add new YouTube video
      if (this.selectedImage) {
        selectedYoutube.main_image = this.selectedImage as any;
      }

      this.youtubeService.addYoutubeSection(selectedYoutube).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'YouTube video added successfully',
          });
          this.loadYoutubeVideos();
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Please Check Your Internet Connection',
          }),
      });
    }

    this.youtubeDialog = false;
    this.selectedYoutube = {} as IYoutube;
    this.selectedImage = null; // Reset image selection
  }

  // Toggle YouTube status
  toggleStatus(youtube: IYoutube) {
    if (youtube.active_status === 0) {
      this.youtubeService.disableYoutubeSection(youtube.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'YouTube video disabled successfully',
          });
          youtube.active_status = 0;
        },
      });
    } else {
      this.youtubeService.enableYoutubeSection(youtube.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'YouTube video enabled successfully',
          });
          youtube.active_status = 1;
        },
      });
    }
  }

  openEditYoutubeDialog(youtube: IYoutube) {
    this.selectedYoutube = { ...youtube };
    this.youtubeDialog = true;
  }

  // Hide dialog
  hideDialog() {
    this.youtubeDialog = false;
    this.submitted = false;
  }

  // Handle image file selection
  onFileSelect(event: any) {
    this.selectedImage = event.target.files[0];
  }
}
