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
import { Subject, debounceTime, distinctUntilChanged, finalize, timer } from 'rxjs';
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
  blogs: BlogsData[] = [];

  allBlogs!: IGetAllBlogs;

  selectedBlogs: any[] = [];

  blog: any = {} as any;

  blogDialog: boolean = false;

  submitted: boolean = false;

  statuses: any[] = [];

  messages: Message[] | undefined;

  selectedStatus: string = '';

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  first: number = 0;
  totalRecords: number = 0;
  loading: boolean = false;
  rowsPerPage = 10;
  currentPage = 1;

  private blogsService = inject(BlogsService);

  private messageService = inject(MessageService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.searchQuery = searchValue;
      this.currentPage = 1;
      this.first = 0;
      this.loadBlogs(1, this.rowsPerPage, this.searchQuery, false);
    });

    this.loadBlogs(this.currentPage, this.rowsPerPage, this.searchQuery, true);
  }

  onSearchInput(event: any): void {
    const value = event.target.value;
    this.searchSubject.next(value);
  }

  loadBlogs(
    page: number = this.currentPage,
    perPage: number = this.rowsPerPage,
    search: string = this.searchQuery,
    showSpinner: boolean = true
  ): void {
    if (showSpinner) {
      this.ngxSpinnerService.show('square-jelly-box');
    }

    this.blogsService.getAllBlogs(page, perPage, search).subscribe({
      next: (response: any) => {
        this.blogs = response?.Blogs?.data || [];
        this.totalRecords = response?.Blogs?.total || 0;
        this.allBlogs = response;
        if (showSpinner) {
          this.ngxSpinnerService.hide('square-jelly-box');
        }
      },
      error: (err) => {
        if (showSpinner) {
          this.ngxSpinnerService.hide('square-jelly-box');
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Happen!',
        });
      }
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
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Updated Successfully',
            life: 3000,
          },
        ];
      } else {
        this.messages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Updated Successfully',
            life: 3000,
          },
        ];
      }
      this.blogDialog = false;
      this.blog = {} as any;
    }
  }

  hideDialog(): void {
    this.blogDialog = false;
    this.submitted = false;
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
    return [10, 50, 100, 500];
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.loadBlogs(this.currentPage, this.rowsPerPage, this.searchQuery);
  }

  onSort(event: any) {
    const field = event.field;
    const order = event.order; // 1 for ASC, -1 for DESC
    if (this.blogs && field) {
      this.blogs.sort((a: any, b: any) => {
        let val1 = a[field];
        let val2 = b[field];

        if (val1 == null && val2 != null) return -1 * order;
        if (val1 != null && val2 == null) return 1 * order;
        if (val1 == null && val2 == null) return 0;

        if (typeof val1 === 'string' && typeof val2 === 'string') {
          return val1.localeCompare(val2) * order;
        }

        return (val1 < val2 ? -1 : val1 > val2 ? 1 : 0) * order;
      });
    }
  }

  viewBlog(blogId: number) {
    window.open(
      `https://fpico-dynamic-fgml.vercel.app/ar/blogs/blogs-details/${blogId}`,
      '_Blank'
    );
  }
}

