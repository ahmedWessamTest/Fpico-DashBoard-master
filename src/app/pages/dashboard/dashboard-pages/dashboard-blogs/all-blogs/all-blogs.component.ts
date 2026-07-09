import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, timer } from 'rxjs';
import {
  BlogsData,
  IGetAllBlogs,
} from '../../../../../core/interfaces/dashboard/blogs/IGetAllBlogs';
import { BlogsService } from '../../../../../core/services/dashboard/content/blogs.service';
import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-all-blogs',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    RatingModule,
    FormsModule,
    TooltipModule,
    InputSwitchModule,
    DatePipe,
    RouterLink,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
  ],
  templateUrl: './all-blogs.component.html',
  styleUrl: './all-blogs.component.scss',
  providers: [MessageService],
})
export class AllBlogsComponent {
  blogs!: BlogsData[];

  allBlogs!: IGetAllBlogs;

  selectedBlogs: any[] = [];

  blog: any = {} as any;

  blogDialog: boolean = false;

  submitted: boolean = false;

  statuses: any[] = [];

  messages: Message[] | undefined;

  selectedStatus: string = '';

  private blogsService = inject(BlogsService);

  private messageService = inject(MessageService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.getBlogsData();
  }

  getBlogsData(): void {
    this.blogsService.getAllBlogs().subscribe({
      next: (response) => {
        this.blogs = response.Blogs.data;
        this.allBlogs = response;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Happen!',
        });
      },
    });
  }

  editBlog(blog: any): void {
    this.blog = { ...blog };
    this.blogDialog = true;
  }

  saveBlog(): void {
    this.submitted = true;
    if (this.blog.post_title && this.blog.post_content) {
      if (this.blog.id) {
        // Update existing blog
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Updated Successfully',
            life: 3000,
          },
        ];
        // Call blogService.updateBlog(this.blog)
      } else {
        // Create new blog
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Updated Successfully',
            life: 3000,
          },
        ];
        // Call blogService.createBlog(this.blog)
      }
      this.blogDialog = false;
      this.blog = {} as any;
    }
  }

  hideDialog(): void {
    this.blogDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(dt: any, event: any): void {
    dt.filterGlobal(event.target.value, 'contains');
  }

  toggleBlogStatus(blog: any): void {
    this.ngxSpinnerService.show('square-jelly-box');
    if (blog.active_status === 0) {
      this.blogsService
        .blogsDisable(blog.id)
        .pipe(
          finalize(() => {
            timer(200).subscribe(() =>
              this.ngxSpinnerService.hide('square-jelly-box')
            );
          })
        )
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Updated Successfully',
            });
          },
        });
    } else {
      this.blogsService
        .blogsEnable(blog.id)
        .pipe(
          finalize(() => {
            timer(200).subscribe(() =>
              this.ngxSpinnerService.hide('square-jelly-box')
            );
          })
        )
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Updated Successfully',
            });
          },
        });
    }
  }

  getPagination(): number[] {
    return [10, 100, 500, 1000, this.blogs.length].sort((a, b) => a - b);
  }

  totalRecords: number = 0;
  loading: boolean = false;
  rowsPerPage = 10;
  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Convert to 1-based index
    this.rowsPerPage = event.rows;
    this.loadBlogs(this.currentPage, this.rowsPerPage);
  }

  loadBlogs(page: number, perPage: number) {
    this.ngxSpinnerService.show('square-jelly-box');
    console.log(page);
    this.blogsService.getAllBlogs(page, perPage).subscribe((response: any) => {
      this.blogs = response.Blogs.data;
      this.totalRecords = response.Blogs.total;
      this.allBlogs = response;
      this.ngxSpinnerService.hide('square-jelly-box');
    });
  }

  viewBlog(blogId: number) {
    window.open(
      `https://fpico-dynamic-fgml.vercel.app/ar/blogs/blogs-details/${blogId}`,
      '_Blank'
    );
  }
}
