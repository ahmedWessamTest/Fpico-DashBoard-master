import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
// PrimeNG Imports
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JoditAngularModule } from 'jodit-angular';
import 'jodit/esm/plugins/add-new-line/add-new-line.js';
import 'jodit/esm/plugins/bold/bold.js';
import 'jodit/esm/plugins/color/color.js';
import 'jodit/esm/plugins/copy-format/copy-format.js';
import 'jodit/esm/plugins/drag-and-drop/drag-and-drop.js';
import 'jodit/esm/plugins/fullsize/fullsize.js';
import 'jodit/esm/plugins/hotkeys/hotkeys.js';
import 'jodit/esm/plugins/iframe/iframe.js';
import 'jodit/esm/plugins/indent/indent.js';
import 'jodit/esm/plugins/justify/justify.js';
import 'jodit/esm/plugins/line-height/line-height.js';
import 'jodit/esm/plugins/preview/preview.js';
import 'jodit/esm/plugins/resizer/resizer.js';
import 'jodit/esm/plugins/search/search.js';
import 'jodit/esm/plugins/select/select.js';
import 'jodit/esm/plugins/source/source.js';
import 'jodit/esm/plugins/symbols/symbols.js';
import 'jodit/esm/plugins/video/video.js';
import 'jodit/esm/plugins/image/image.js';
import 'jodit/esm/plugins/image-properties/image-properties.js';
import 'jodit/esm/plugins/clean-html/clean-html.js';

import { JoditConfig, NgxJoditComponent } from 'ngx-jodit';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { Jodit } from 'jodit';
import { IUploader, IUploaderAnswer, IUploaderData } from 'jodit/types/types';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { WEB_SITE_BASE_URL } from '../../../../../core/constants/WEB_SITE_BASE_UTL';
import { IGetBlogById } from '../../../../../core/interfaces/dashboard/blogs/IGetBlogById';
import { BlogsService } from '../../../../../core/services/dashboard/content/blogs.service';
import { FpicoServicesService } from '../../../../../core/services/dashboard/content/fpico-services.service';

@Component({
  selector: 'app-blogs-add',
  standalone: true,
  imports: [
    EditorModule,
    FileUploadModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    InputSwitchModule,
    ReactiveFormsModule,
    JoditAngularModule,
    FormsModule,
    NgxJoditComponent,
    ToastModule,
    DropdownModule,
    MultiSelectModule,
    CommonModule,
    CardModule,
    CalendarModule,
    DialogModule,
    NgxSpinnerModule,
    FloatLabelModule,
    TooltipModule,
  ],
  templateUrl: './blogs-add.component.html',
  styleUrl: './blogs-add.component.scss',
  providers: [MessageService],
})
export class BlogsAddComponent {
  articleContent: string = '';

  currentBlogId: number = 0;

  isPreview: boolean = false;

  value = '';

  _optionsStr = '';

  authors: any[] = [];

  categories: any[] = [];

  currentImageSrc: string = '';

  currentDate = '';

  approveDialogVisible = false;

  currentBlog!: any;

  seoTitleWarning: string | null = null;

  duplicateWordWarning: string | null = null;

  addBlogsForm!: FormGroup;

  contentLengthWarning: string | null = null;

  isContentEmpty: boolean = true;


  blogsService = inject(BlogsService);
  fpicoServicesService = inject(FpicoServicesService);

  servicesList: { id: number; name: string }[] = [];

  _MessageService = inject(MessageService);

  _ActivatedRoute = inject(ActivatedRoute);

  _NgxSpinnerService = inject(NgxSpinnerService);

  _Router = inject(Router);

  isEditing: boolean = false;

  date = new Date();

  fb = inject(FormBuilder);

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  isFormInitialized: boolean = false;
  isSubmittingOrResetting: boolean = false;

  ngOnInit(): void {
    this.loadServices();
    this.initForm();
    this.inOpenCheckCurrentBlog();

    this.addBlogsForm.get('ar_blog_text')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      if (this.isFormInitialized && !this.isSubmittingOrResetting) {
        this.checkDeletedImages();
      }
    });

    this.addBlogsForm.get('en_blog_text')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      if (this.isFormInitialized && !this.isSubmittingOrResetting) {
        this.checkDeletedImages();
      }
    });

    // Mark form initialized after brief delay to avoid false deletions during component mounting
    setTimeout(() => {
      this.isFormInitialized = true;
    }, 1000);
  }

  loadServices(): void {
    this.fpicoServicesService.getAllServices().subscribe({
      next: (response) => {
        if (response && response.rows) {
          this.servicesList = response.rows.map((service) => ({
            id: service.id,
            name: service.ar_service_title && service.en_service_title
              ? `${service.ar_service_title} | ${service.en_service_title}`
              : (service.ar_service_title || service.en_service_title || `Service #${service.id}`)
          }));

          const currentVal = this.addBlogsForm?.get('service_ids')?.value;
          if (Array.isArray(currentVal) && currentVal.length > 0) {
            this.addBlogsForm.get('service_ids')?.setValue([...currentVal], { emitEvent: false });
          }
        }
      },
      error: (err) => {
        console.error('Failed to load services for blog', err);
      }
    });
  }

  constructor() { }

  initForm() {
    this.addBlogsForm = this.fb.group({
      en_blog_title: [''],
      ar_blog_title: ['', Validators.required],
      en_blog_text: [''],
      ar_blog_text: ['', Validators.required],
      main_image: ['', Validators.required],
      blog_date: [new Date(), Validators.required],
      en_meta_title: [''],
      ar_meta_title: ['', Validators.required],
      en_meta_text: [''],
      ar_meta_text: ['', Validators.required],
      active_status: ['', Validators.required],
      en_script_text: [''],
      ar_script_text: ['', Validators.required],
      ar_cta_first_title: [''],
      ar_cta_second_title: [''],
      en_cta_first_title: [''],
      en_cta_second_title: [''],
      service_ids: [[]],
    });
  }

  inOpenCheckCurrentBlog() {
    const BLOG_DETAILS = this._ActivatedRoute.snapshot.data[
      'blogDetails'
    ] as IGetBlogById;
    if (BLOG_DETAILS) {
      console.log(BLOG_DETAILS.blog);
      this.isEditing = true;
      this.currentBlogId = BLOG_DETAILS.blog.id;

      // Extract existing service IDs
      let selectedServiceIds: number[] = [];
      const blogData = BLOG_DETAILS.blog as any;
      const rootData = BLOG_DETAILS as any;

      if (Array.isArray(blogData?.services)) {
        selectedServiceIds = blogData.services
          .map((s: any) => (typeof s === 'object' && s !== null ? s.id : Number(s)))
          .filter((id: number) => !isNaN(id));
      } else if (Array.isArray(blogData?.service_ids)) {
        selectedServiceIds = blogData.service_ids
          .map((id: any) => Number(id))
          .filter((id: number) => !isNaN(id));
      } else if (Array.isArray(rootData?.services)) {
        selectedServiceIds = rootData.services
          .map((s: any) => (typeof s === 'object' && s !== null ? s.id : Number(s)))
          .filter((id: number) => !isNaN(id));
      } else if (Array.isArray(rootData?.service_ids)) {
        selectedServiceIds = rootData.service_ids
          .map((id: any) => Number(id))
          .filter((id: number) => !isNaN(id));
      }

      // Preprocess the blog object to replace null values with empty strings
      const sanitizedBlog = Object.fromEntries(
        Object.entries(BLOG_DETAILS.blog).map(([key, value]) => [
          key,
          value ?? '',
        ])
      );

      delete sanitizedBlog['service_ids'];
      delete sanitizedBlog['services'];

      // Track initial images BEFORE patchValue
      const arText = sanitizedBlog['ar_blog_text'] || '';
      const enText = sanitizedBlog['en_blog_text'] || '';
      this.extractImageNames(arText).forEach(name => this.trackedImages.add(name));
      this.extractImageNames(enText).forEach(name => this.trackedImages.add(name));

      this.addBlogsForm.patchValue(sanitizedBlog, { emitEvent: false });

      if (this.addBlogsForm.get('blog_date')?.value) {
        this.addBlogsForm
          .get('blog_date')
          ?.setValue(new Date(this.addBlogsForm.get('blog_date')?.value), { emitEvent: false });
      }

      this.addBlogsForm.get('service_ids')?.setValue(selectedServiceIds, { emitEvent: false });
    }
  }

  onSubmit(): void {
    const formValues = this.addBlogsForm.value;
    const formData = new FormData();
    formData.append('en_blog_title', formValues.en_blog_title);
    formData.append('ar_blog_title', formValues.ar_blog_title);
    formData.append('en_blog_text', formValues.en_blog_text);
    formData.append('ar_blog_text', formValues.ar_blog_text);
    formData.append('blog_date', formValues.blog_date);
    formData.append('en_meta_title', formValues.en_meta_title);
    formData.append('ar_meta_title', formValues.ar_meta_title);
    formData.append('en_meta_text', formValues.en_meta_text);
    formData.append('ar_meta_text', formValues.ar_meta_text);
    formData.append('active_status', formValues.active_status);
    formData.append('en_script_text', formValues.en_script_text);
    formData.append('ar_script_text', formValues.ar_script_text);

    formData.append('ar_cta_first_title', formValues.ar_cta_first_title ? formValues.ar_cta_first_title.trim() : '');
    formData.append('ar_cta_second_title', formValues.ar_cta_second_title ? formValues.ar_cta_second_title.trim() : '');
    formData.append('en_cta_first_title', formValues.en_cta_first_title ? formValues.en_cta_first_title.trim() : '');
    formData.append('en_cta_second_title', formValues.en_cta_second_title ? formValues.en_cta_second_title.trim() : '');

    const rawServiceIds = this.addBlogsForm.get('service_ids')?.value;
    let serviceIds: number[] = [];
    if (Array.isArray(rawServiceIds)) {
      serviceIds = rawServiceIds
        .map((s: any) => (typeof s === 'object' && s !== null ? Number(s.id) : Number(s)))
        .filter((id: number) => !isNaN(id));
    }

    if (serviceIds.length > 0) {
      serviceIds.forEach((id: number) => {
        formData.append('service_ids[]', id.toString());
      });
    } else {
      formData.append('service_ids[]', '');
      formData.append('service_ids', JSON.stringify([]));
    }

    console.log(formValues);
    if (this.fileUpload.files.length > 0) {
      formData.append(
        'main_image',
        formValues.main_image,
        formValues.main_image.name
      );
    }

    if (this.isEditing) {
      if (this.addBlogsForm.invalid) {
        this.addBlogsForm.markAllAsTouched();
        return;
      }
      this.isSubmittingOrResetting = true;
      this._NgxSpinnerService.show('square-jelly-box');
      this.blogsService.updateBlog(this.currentBlogId, formData).subscribe({
        next: (response) => {
          this.trackedImages.clear(); // Clear tracked images so none are deleted on reset
          this._MessageService.add({
            severity: 'success',
            summary: 'Blog Updated',
            detail: 'Blog Has Been Updated Successfully!',
          });
          this.addBlogsForm.reset({}, { emitEvent: false });
          this.addBlogsForm.get('post_content')?.setValue('', { emitEvent: false });
          this.addBlogsForm.get('service_ids')?.setValue([], { emitEvent: false });
          this._NgxSpinnerService.hide('square-jelly-box');
          setTimeout(() => {
            this._Router.navigate(['/dashboard/blogs']);
          }, 500);
        },
        error: (err) => {
          this.isSubmittingOrResetting = false;
          this._MessageService.add({
            severity: 'error',
            summary: 'Update Error!',
            detail: 'Error Happen!',
          });
          this._NgxSpinnerService.hide('square-jelly-box');
        },
      });
    } else {
      if (this.addBlogsForm.invalid) {
        this.addBlogsForm.markAllAsTouched();
        return;
      }
      this.isSubmittingOrResetting = true;
      this._NgxSpinnerService.show('square-jelly-box');
      this.blogsService.addBlog(formData).subscribe({
        next: (response) => {
          this.trackedImages.clear(); // Clear tracked images so none are deleted on reset
          this.clearInputs();
          this._MessageService.add({
            severity: 'success',
            summary: 'Blog Published',
            detail: 'Blog Has Been Published Successfully!',
          });
          this._NgxSpinnerService.hide('square-jelly-box');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          this.isSubmittingOrResetting = false;
          this._MessageService.add({
            severity: 'error',
            summary: 'Published Error!',
            detail: 'Error Happen!',
          });
          this._NgxSpinnerService.hide('square-jelly-box');
        },
      });
    }
  }

  clearInputs(): void {
    this.isSubmittingOrResetting = true;
    this.trackedImages.clear();
    this.addBlogsForm.reset({}, { emitEvent: false });
    this.addBlogsForm.get('blog_date')?.setValue(new Date(), { emitEvent: false });
    this.addBlogsForm.get('en_blog_text')?.setValue('', { emitEvent: false });
    this.addBlogsForm.get('ar_blog_text')?.setValue('', { emitEvent: false });
    this.addBlogsForm.get('active_status')?.setValue(1, { emitEvent: false });
    this.addBlogsForm.get('service_ids')?.setValue([], { emitEvent: false });
    console.log(this.fileUpload);
    if (this.fileUpload) {
      (this.fileUpload as FileUpload).clear();
    }
    setTimeout(() => {
      this.isSubmittingOrResetting = false;
    }, 500);
  }

  onFileSelect(event: any): void {
    const files = event.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.addBlogsForm.patchValue({ main_image: file });
    }
  }

  trackedImages: Set<string> = new Set<string>();

  extractImageNames(html: string): string[] {
    if (!html) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgs = doc.getElementsByTagName('img');
    const names: string[] = [];
    for (let i = 0; i < imgs.length; i++) {
      const src = imgs[i].getAttribute('src');
      if (src) {
        const cleanSrc = src.split('?')[0];
        const name = cleanSrc.split('/').pop();
        if (name) {
          names.push(name);
        }
      }
    }
    return names;
  }

  checkDeletedImages(): void {
    if (!this.isFormInitialized || this.isSubmittingOrResetting) {
      return;
    }

    const arText = this.addBlogsForm.get('ar_blog_text')?.value || '';
    const enText = this.addBlogsForm.get('en_blog_text')?.value || '';

    // Safety check: Do not delete if both texts are completely empty (e.g. during reset)
    if (!arText && !enText && this.trackedImages.size > 0) {
      return;
    }

    const currentImages = new Set<string>([
      ...this.extractImageNames(arText),
      ...this.extractImageNames(enText)
    ]);

    for (const trackedImage of this.trackedImages) {
      if (!currentImages.has(trackedImage)) {
        this.deleteImageFromBackend(trackedImage);
        this.trackedImages.delete(trackedImage);
      }
    }
  }

  deleteImageFromBackend(imageName: string): void {
    this.blogsService.deleteImage(imageName, 'blogs').subscribe({
      next: (response) => {
        console.log(`✅ Image ${imageName} deleted successfully:`, response);
      },
      error: (err) => {
        console.error(`❌ Failed to delete image ${imageName}:`, err);
      }
    });
  }

  @ViewChild('ngxJoditAR') ngxJoditAR!: any;
  @ViewChild('ngxJoditEn') ngxJoditEn!: any;

  ngAfterViewInit(): void {
    if (this.ngxJoditAR) {
      this.ngxJoditAR.jodit?.registeredButtons.add({
        22: { group: 'source', name: 'left' },
      });
    }
    if (this.ngxJoditEn) {
      this.ngxJoditEn.jodit?.registeredButtons.add({
        22: { group: 'source', name: 'left' },
      });
    }
    this.addBlogsForm
      .get('ar_blog_text')
      ?.valueChanges.subscribe((value) => { });
  }

  approveBlog() {
    console.log(this.addBlogsForm.value);
    this.onSubmit();
    this.approveDialogVisible = true;
  }

  options_EN: JoditConfig = {
    uploader: {
      url: WEB_SITE_BASE_URL + 'resizeImage',

      insertImageAsBase64URI: false,
      method: 'POST',
      format: 'json',
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      filesVariableName: () => 'post_image',
      pathVariableName: '',
      withCredentials: false,
      data: null,
      processFileName: function (
        key: string,
        file: File,
        name: string
      ): [string, File, string] {
        return [key, file, name.replace(/\s+/g, '_')]; // Fix filename
      },

      getDisplayName: function (baseurl: string, filename: string): string {
        return filename; // Return filename properly
      },

      prepareData: async (formData: FormData) => {
        const files: File[] = [];
        formData.forEach((value, key) => {
          if (key === 'post_image' && value instanceof File) {
            files.push(value);
          }
        });

        if (!files.length) {
          return formData;
        }

        this.showLoader();
        for (let i = 0; i < files.length; i++) {
          const compressed = await this.compressImage(files[i]);
          if (compressed) {
            const uniqueFilename = `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 10)}-${compressed.name}`;
            formData.set('post_image', compressed, uniqueFilename);
          }
        }
        this.hideLoader();

        return formData;
      },

      isSuccess: (resp: any): boolean => {
        return !!(resp && resp.success);
      },

      process: (resp: any): IUploaderData => {
        const imageUrl = resp?.success || '';
        if (imageUrl) {
          const cleanUrl = imageUrl.split('?')[0];
          const imageName = cleanUrl.split('/').pop();
          if (imageName) {
            this.trackedImages.add(imageName);
          }
        }
        return {
          files: imageUrl ? [imageUrl] : [],
          isImages: [true],
          path: '',
          baseurl: '',
        };
      },

      defaultHandlerError: (e: Error) => {
        console.error('❌ Jodit Upload Error:', e.message);
      },

      error: (e: Error): void => {
        console.error('❌ Upload Failed:', e);
      },

      contentType: (file: File) => file.type,
      getMessage: function (this: IUploader, resp: IUploaderAnswer): string {
        return '';
      },
      defaultHandlerSuccess: function (this: any, resp: IUploaderData): void {
        const j = this.j || this;
        if (resp.files && resp.files.length) {
          resp.files.forEach((file: string) => {
            if (j && j.selection) {
              j.selection.insertImage(file);
            }
          });
        }
      },
    },

    events: {
      // ✅ Handle drag & drop images
      beforeFilePaste: async (data: { files: FileList }, editor: Jodit) => {
        const files = Array.from(data.files);
        for (const file of files) {
          await this.uploadImage_EN(file);
        }
        return false; // Prevent Jodit from handling the image
      },

      // ✅ Handle copy-paste images
      paste: async (event: ClipboardEvent, editor: any) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        let hasImage = false;
        this.showLoader(); // Show loader before upload

        const uploadPromises: Promise<void>[] = [];

        for (const item of Array.from(items)) {
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            console.log(file);
            hasImage = true;

            if (file) {
              uploadPromises.push(this.uploadImage_EN(file)); // Collect upload promises
            }
          }
        }

        await Promise.all(uploadPromises); // Wait for all uploads to complete
        if (hasImage) {
          event.preventDefault(); // Only prevent pasting if an image is detected
        }
        this.hideLoader(); // Hide loader after all images finish uploading
      },
    },
    spellcheck: true,
    language: 'en',
    minHeight: 300,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    extraButtons: [
      {
        name: 'cleanFormatAuto',
        icon: 'eraser',
        tooltip: 'Remove Formatting Automatically',
        exec: () => {
          this.removeFormat('en');
        },
      },
    ],
    image: {
      openOnDblClick: true,
      editAlt: true,
      editTitle: true,
      editLink: true,
      editSize: true,
      editAlign: true,
      showPreview: true,
    } as any,
  };
  options_AR: JoditConfig = {
    uploader: {
      url: WEB_SITE_BASE_URL + 'resizeImage',

      insertImageAsBase64URI: false,
      method: 'POST',
      format: 'json',
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      filesVariableName: () => 'post_image',
      pathVariableName: '',
      withCredentials: false,
      data: null,
      processFileName: function (
        key: string,
        file: File,
        name: string
      ): [string, File, string] {
        return [key, file, name.replace(/\s+/g, '_')]; // Fix filename
      },

      getDisplayName: function (baseurl: string, filename: string): string {
        return filename; // Return filename properly
      },

      prepareData: async (formData: FormData) => {
        const files: File[] = [];
        formData.forEach((value, key) => {
          if (key === 'post_image' && value instanceof File) {
            files.push(value);
          }
        });

        if (!files.length) {
          return formData;
        }

        this.showLoader();
        for (let i = 0; i < files.length; i++) {
          const compressed = await this.compressImage(files[i]);
          if (compressed) {
            const uniqueFilename = `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 10)}-${compressed.name}`;
            formData.set('post_image', compressed, uniqueFilename);
          }
        }
        this.hideLoader();

        return formData;
      },

      isSuccess: (resp: any): boolean => {
        return !!(resp && resp.success);
      },

      process: (resp: any): IUploaderData => {
        const imageUrl = resp?.success || '';
        if (imageUrl) {
          const cleanUrl = imageUrl.split('?')[0];
          const imageName = cleanUrl.split('/').pop();
          if (imageName) {
            this.trackedImages.add(imageName);
          }
        }
        return {
          files: imageUrl ? [imageUrl] : [],
          isImages: [true],
          path: '',
          baseurl: '',
        };
      },

      defaultHandlerError: (e: Error) => {
        console.error('❌ Jodit Upload Error:', e.message);
      },

      error: (e: Error): void => {
        console.error('❌ Upload Failed:', e);
      },

      contentType: (file: File) => file.type,
      getMessage: function (this: IUploader, resp: IUploaderAnswer): string {
        return '';
      },
      defaultHandlerSuccess: function (this: any, resp: IUploaderData): void {
        const j = this.j || this;
        if (resp.files && resp.files.length) {
          resp.files.forEach((file: string) => {
            if (j && j.selection) {
              j.selection.insertImage(file);
            }
          });
        }
      },
    },

    events: {
      // ✅ Handle drag & drop images
      beforeFilePaste: async (data: { files: FileList }, editor: Jodit) => {
        const files = Array.from(data.files);
        for (const file of files) {
          await this.uploadImage_AR(file);
        }
        return false; // Prevent Jodit from handling the image
      },

      // ✅ Handle copy-paste images
      paste: async (event: ClipboardEvent, editor: any) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        // event.preventDefault(); // Prevent default paste behavior
        let hasImage = false;
        this.showLoader(); // Show loader before upload

        const uploadPromises: Promise<void>[] = [];

        for (const item of Array.from(items)) {
          // Ensure iteration works
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            console.log(file);
            hasImage = true;

            if (file) {
              uploadPromises.push(this.uploadImage_AR(file)); // Collect upload promises
            }
          }
        }

        await Promise.all(uploadPromises); // Wait for all uploads to complete
        if (hasImage) {
          event.preventDefault(); // Only prevent pasting if an image is detected
        }
        this.hideLoader(); // Hide loader after all images finish uploading
      },

      // ✅ Handle inserting images manually
    },
    spellcheck: true,
    language: 'ar',
    minHeight: 300,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    extraButtons: [
      {
        name: 'cleanFormatAuto',
        icon: 'eraser',
        tooltip: 'إزالة التنسيق تلقائياً (Remove Formatting)',
        exec: () => {
          this.removeFormat('ar');
        },
      },
    ],
    image: {
      openOnDblClick: true,
      editAlt: true,
      editTitle: true,
      editLink: true,
      editSize: true,
      editAlign: true,
      showPreview: true,
    } as any,
  };

  async compressImage(file: File): Promise<File | null> {
    console.log('compressImage');

    try {
      console.log('Compressing image:', file);

      // 🔹 Change maxWidth and maxHeight for better quality
      const compressedBlob = await this.resizeImage(file, 800, 800, file.type);

      if (!(compressedBlob instanceof Blob)) {
        console.error('Compressed result is not a valid Blob:', compressedBlob);
        return null;
      }

      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });

      console.log('✅ Compressed File:', compressedFile);
      return compressedFile;
    } catch (error) {
      console.error('❌ Compression error:', error);
      return null;
    }
  }

  async uploadImage_EN(file: File, delayTime = 500) {
    // Default delay: 500ms
    console.log('📤 Uploading image:', file.name, file.size / 1024 / 1024);

    // ✅ 1️⃣ Compress the image
    const compressedFile = await this.compressImage(file);
    if (!compressedFile) {
      console.error('❌ Image compression failed:', file.name);
      return;
    }

    console.log(
      '📤 Compressed:',
      compressedFile.name,
      compressedFile.size / 1024 / 1024
    );

    // ✅ 3️⃣ Generate a truly unique filename
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}-${compressedFile.name}`;

    const formData = new FormData();
    formData.append('post_image', compressedFile, uniqueFilename);

    console.log('📤 Sending FormData:', uniqueFilename);

    // ✅ 4️⃣ Introduce a small delay before making the request
    await new Promise((resolve) => setTimeout(resolve, delayTime));

    try {
      // ✅ 5️⃣ Append a unique timestamp to prevent caching
      const apiUrl = WEB_SITE_BASE_URL + 'resizeImage';

      // ✅ 6️⃣ Send the request
      const response = await fetch(apiUrl, { method: 'POST', body: formData });
      const data = await response.json();

      console.log('✅ Upload successful:', data);

      if (data.success) {
        const imageUrl = data.success;
        console.log('🖼️ Image Uploaded:', imageUrl);

        // Track uploaded image filename
        const cleanUrl = imageUrl.split('?')[0];
        const imageName = cleanUrl.split('/').pop();
        if (imageName) {
          this.trackedImages.add(imageName);
        }

        // ✅ 7️⃣ Slightly delay image insertion to prevent race conditions
        setTimeout(() => {
          (this.ngxJoditEn.jodit as Jodit).selection.insertImage(imageUrl);
        }, 100);
        setTimeout(
          () => (this.ngxJoditEn.jodit as Jodit).selection.clear(),
          500
        );
      } else {
        console.error('❌ Upload response does not contain a valid image URL');
      }
    } catch (err) {
      console.error('❌ Upload failed:', err);
    }
  }
  async uploadImage_AR(file: File, delayTime = 500) {
    // Default delay: 500ms
    console.log('📤 Uploading image:', file.name, file.size / 1024 / 1024);

    // ✅ 1️⃣ Compress the image
    const compressedFile = await this.compressImage(file);
    if (!compressedFile) {
      console.error('❌ Image compression failed:', file.name);
      return;
    }

    console.log(
      '📤 Compressed:',
      compressedFile.name,
      compressedFile.size / 1024 / 1024
    );

    // ✅ 3️⃣ Generate a truly unique filename
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}-${compressedFile.name}`;

    const formData = new FormData();
    formData.append('post_image', compressedFile, uniqueFilename);

    console.log('📤 Sending FormData:', uniqueFilename);

    // ✅ 4️⃣ Introduce a small delay before making the request
    await new Promise((resolve) => setTimeout(resolve, delayTime));

    try {
      // ✅ 5️⃣ Append a unique timestamp to prevent caching
      const apiUrl = WEB_SITE_BASE_URL + 'resizeImage';

      // ✅ 6️⃣ Send the request
      const response = await fetch(apiUrl, { method: 'POST', body: formData });
      const data = await response.json();

      console.log('✅ Upload successful:', data);

      if (data.success) {
        const imageUrl = data.success;
        console.log('🖼️ Image Uploaded:', imageUrl);

        // Track uploaded image filename
        const cleanUrl = imageUrl.split('?')[0];
        const imageName = cleanUrl.split('/').pop();
        if (imageName) {
          this.trackedImages.add(imageName);
        }

        // ✅ 7️⃣ Slightly delay image insertion to prevent race conditions
        setTimeout(() => {
          (this.ngxJoditAR.jodit as Jodit).selection.insertImage(imageUrl);
        }, 100);
        setTimeout(
          () => (this.ngxJoditAR.jodit as Jodit).selection.clear(),
          500
        );
      } else {
        console.error('❌ Upload response does not contain a valid image URL');
      }
    } catch (err) {
      console.error('❌ Upload failed:', err);
    }
  }

  async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    mimeType: string
  ): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not found'));

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scaleFactor);
          height = Math.round(height * scaleFactor);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'));
            resolve(blob);
            URL.revokeObjectURL(img.src); // Clean up the object URL
            canvas.width = 0; // Clear the canvas
            canvas.height = 0;
          },
          mimeType,
          1
        );
      };
      img.onerror = (err) => reject(err);
    });
  }

  async localImageToFile(imagePath: string, filename: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath; // Path to your local asset
      img.crossOrigin = 'Anonymous'; // Ensures CORS doesn't block canvas
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('❌ Failed to create blob.');
            return reject(null);
          }
          const file = new File([blob], filename, { type: 'image/png' });
          resolve(file);
        }, 'image/png');
      };
      img.onerror = (err) => reject(err);
    });
  }
  // Show loader
  showLoader() {
    this.loading = true;
    this._NgxSpinnerService.show('square-jelly-box'); // If using ngx-_NgxSpinnerService
  }
  loading = false; // Track loading state

  // Hide loader
  hideLoader() {
    this.loading = false;
    this._NgxSpinnerService.hide('square-jelly-box'); // If using ngx-_NgxSpinnerService
  }

  onCancelBlogClick() {
    if (this.isEditing) {
      this._Router.navigate(['/dashboard/blogs/blogs-index']);
    } else {
      this.clearInputs();
      this.fileUpload.clear();
    }
  }

  /**
   * Automatically cleans formatting, inline styles, font families, colors,
   * classes and extraneous tags from HTML content.
   */
  cleanHtmlContent(html: string): string {
    if (!html || !html.trim()) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 1. Remove script, style, meta, link, iframe, etc.
    const removeSelectors = ['script', 'style', 'meta', 'link', 'noscript', 'iframe'];
    removeSelectors.forEach((sel) => {
      doc.querySelectorAll(sel).forEach((el) => el.remove());
    });

    // 2. Remove HTML comments
    const removeComments = (node: Node) => {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.COMMENT_NODE) {
          node.removeChild(child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          removeComments(child);
        }
      }
    };
    removeComments(doc.body);

    // 3. Formatting tags to unwrap (preserve inner text, remove formatting wrapper)
    const tagsToUnwrap = new Set([
      'font',
      'span',
      'b',
      'strong',
      'i',
      'em',
      'u',
      's',
      'strike',
      'mark',
      'small',
      'big',
      'sub',
      'sup',
      'tt',
    ]);

    // 4. Attributes to remove from all remaining elements
    const attrsToRemove = [
      'style',
      'class',
      'id',
      'color',
      'face',
      'size',
      'bgcolor',
      'background',
      'align',
      'valign',
      'border',
    ];

    // Iteratively unwrap target tags
    let found = true;
    while (found) {
      found = false;
      const elements = Array.from(doc.body.querySelectorAll('*'));
      for (const el of elements) {
        const tagName = el.tagName.toLowerCase();
        if (tagsToUnwrap.has(tagName) || tagName.includes(':')) {
          found = true;
          const parent = el.parentNode;
          if (parent) {
            while (el.firstChild) {
              parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
          }
        }
      }
    }

    // 5. Remove unwanted attributes from remaining elements
    const remainingElements = Array.from(doc.body.querySelectorAll('*'));
    for (const el of remainingElements) {
      attrsToRemove.forEach((attr) => el.removeAttribute(attr));
      if (el.tagName.toLowerCase() === 'a') {
        const href = el.getAttribute('href');
        const target = el.getAttribute('target');
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name);
        }
        if (href) el.setAttribute('href', href);
        if (target) el.setAttribute('target', target);
      }
    }

    let cleaned = doc.body.innerHTML.trim();

    // Normalize non-breaking spaces
    cleaned = cleaned.replace(/&nbsp;/g, ' ');

    // Remove empty paragraphs
    cleaned = cleaned.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '');

    // Ensure valid HTML paragraph if plain text
    if (cleaned && !cleaned.startsWith('<')) {
      cleaned = `<p>${cleaned}</p>`;
    }

    return cleaned;
  }

  /**
   * Removes text formatting from the specified editor (ar or en) automatically
   */
  removeFormat(lang: 'ar' | 'en'): void {
    const controlName = lang === 'ar' ? 'ar_blog_text' : 'en_blog_text';
    const joditComponent = lang === 'ar' ? this.ngxJoditAR : this.ngxJoditEn;
    const currentHtml = this.addBlogsForm.get(controlName)?.value || '';

    if (!currentHtml || !currentHtml.trim()) {
      this._MessageService.add({
        severity: 'info',
        summary: 'Info',
        detail:
          lang === 'ar'
            ? 'لا يوجد نص لإزالة التنسيق منه'
            : 'No text to remove formatting from',
      });
      return;
    }

    const cleanedHtml = this.cleanHtmlContent(currentHtml);

    // Update form control
    this.addBlogsForm.get(controlName)?.setValue(cleanedHtml);
    this.addBlogsForm.get(controlName)?.markAsDirty();

    // Update Jodit editor instance directly if available
    if (joditComponent?.jodit) {
      joditComponent.jodit.value = cleanedHtml;
    }

    this._MessageService.add({
      severity: 'success',
      summary: 'Success',
      detail:
        lang === 'ar'
          ? 'تمت إزالة كافة تنسيقات النص بنجاح'
          : 'Text formatting removed successfully',
    });
  }
}
