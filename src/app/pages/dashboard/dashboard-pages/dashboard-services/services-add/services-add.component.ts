import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxJoditComponent } from 'ngx-jodit';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { WEB_SITE_BASE_URL_IMAGE } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { FpicoServicesService } from '../../../../../core/services/dashboard/content/fpico-services.service';

@Component({
  selector: 'app-services-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    FileUploadModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    NgxJoditComponent,
    NgxSpinnerModule,
  ],
  templateUrl: './services-add.component.html',
  styleUrl: './services-add.component.scss',
  providers: [MessageService],
})
export class ServicesAddComponent implements OnInit {
  addServicesForm!: FormGroup;
  isEditing: boolean = false;
  currentServiceId: number = 0;
  selectedImage: File | null = null;
  currentImageSrc: string = '';

  private fb = inject(FormBuilder);
  private fpicoServicesService = inject(FpicoServicesService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _Router = inject(Router);
  private _MessageService = inject(MessageService);
  private _NgxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.initForm();
    this._ActivatedRoute.paramMap.subscribe((params) => {
      const idStr = params.get('id');
      if (idStr) {
        this.currentServiceId = Number(idStr);
        this.isEditing = true;
        this.loadServiceDetails();
      }
    });
  }

  initForm(): void {
    this.addServicesForm = this.fb.group({
      en_service_title: [''],
      ar_service_title: ['', Validators.required],
      en_service_text: [''],
      ar_service_text: ['', Validators.required],
      main_image: ['', Validators.required],
      en_meta_title: [''],
      ar_meta_title: ['', Validators.required],
      en_meta_text: [''],
      ar_meta_text: ['', Validators.required],
      home_status: [0, Validators.required],
      active_status: [1, Validators.required],
    });
  }

  loadServiceDetails(): void {
    this._NgxSpinnerService.show('square-jelly-box');
    this.fpicoServicesService.getAllServices().subscribe({
      next: (response) => {
        const service = response.rows.find((s) => s.id === this.currentServiceId);
        if (service) {
          // Preprocess fields, fallback null to empty string
          const sanitizedService = Object.fromEntries(
            Object.entries(service).map(([key, value]) => [
              key,
              value ?? '',
            ])
          );
          this.addServicesForm.patchValue(sanitizedService);

          if (service.main_image) {
            this.currentImageSrc =
              WEB_SITE_BASE_URL_IMAGE + 'service/' + service.main_image;
          }
        } else {
          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Service not found',
          });
          this._Router.navigate(['/dashboard/services']);
        }
        this._NgxSpinnerService.hide('square-jelly-box');
      },
      error: () => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load service details',
        });
        this._NgxSpinnerService.hide('square-jelly-box');
      },
    });
  }

  onFileSelect(event: any): void {
    const files = event.files;
    if (files && files.length > 0) {
      this.selectedImage = files[0];
      this.addServicesForm.patchValue({ main_image: this.selectedImage });
    }
  }

  submitForm(): void {
    if (this.addServicesForm.invalid) {
      this._MessageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields.',
      });
      return;
    }

    this._NgxSpinnerService.show('square-jelly-box');
    const formValues = this.addServicesForm.value;
    const formData = new FormData();

    formData.append('en_service_title', formValues.en_service_title || '');
    formData.append('ar_service_title', formValues.ar_service_title);
    formData.append('en_service_text', formValues.en_service_text || '');
    formData.append('ar_service_text', formValues.ar_service_text);
    formData.append('en_meta_title', formValues.en_meta_title || '');
    formData.append('ar_meta_title', formValues.ar_meta_title);
    formData.append('en_meta_text', formValues.en_meta_text || '');
    formData.append('ar_meta_text', formValues.ar_meta_text);
    formData.append('service_type', 'service');
    formData.append('home_status', formValues.home_status.toString());
    formData.append('active_status', formValues.active_status.toString());

    if (this.selectedImage) {
      formData.append(
        'main_image',
        this.selectedImage,
        this.selectedImage.name
      );
    }

    if (this.isEditing) {
      this.fpicoServicesService
        .updateServices(this.currentServiceId, formData)
        .subscribe({
          next: () => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Service updated successfully',
            });
            this._NgxSpinnerService.hide('square-jelly-box');
            setTimeout(() => {
              this._Router.navigate(['/dashboard/services']);
            }, 1000);
          },
          error: () => {
            this._MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update service',
            });
            this._NgxSpinnerService.hide('square-jelly-box');
          },
        });
    } else {
      this.fpicoServicesService.addServices(formData).subscribe({
        next: () => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Service added successfully',
          });
          this._NgxSpinnerService.hide('square-jelly-box');
          setTimeout(() => {
            this._Router.navigate(['/dashboard/services']);
          }, 1000);
        },
        error: () => {
          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add service',
          });
          this._NgxSpinnerService.hide('square-jelly-box');
        },
      });
    }
  }

  onCancel(): void {
    this._Router.navigate(['/dashboard/services']);
  }
}
