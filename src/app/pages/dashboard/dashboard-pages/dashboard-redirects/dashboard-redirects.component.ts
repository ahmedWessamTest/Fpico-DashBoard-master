import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BlogsService } from '../../../../core/services/dashboard/content/blogs.service';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';

interface RedirectRule {
  selectedBlogs: any[];
  toSlug: string;
  isDropdownOpen: boolean;
  searchQuery: string;
}

@Component({
  selector: 'app-dashboard-redirects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    NgxSpinnerModule,
    LoadingDataBannerComponent,
  ],
  templateUrl: './dashboard-redirects.component.html',
  styleUrl: './dashboard-redirects.component.scss',
  providers: [MessageService],
})
export class DashboardRedirectsComponent implements OnInit {
  private _BlogsService = inject(BlogsService);
  private _MessageService = inject(MessageService);
  private _NgxSpinnerService = inject(NgxSpinnerService);

  // Global list of blogs shared by all dropdowns
  blogsList: any[] = [];
  currentPage: number = 1;
  loadingBlogs: boolean = false;
  hasMoreBlogs: boolean = true;
  initialLoadDone: boolean = false;

  // List of redirect rules
  redirectRules: RedirectRule[] = [];

  // Saving state
  isSaving: boolean = false;

  ngOnInit() {
    this.fetchBlogs(1);
    this.addRule(); // Add one initial blank rule
  }

  fetchBlogs(page: number, searchQuery: string = '') {
    if (this.loadingBlogs || (!this.hasMoreBlogs && page > 1)) return;
    this.loadingBlogs = true;

    this._BlogsService.getAllBlogs(page, 20, searchQuery).subscribe({
      next: (response) => {
        if (response && response.Blogs && response.Blogs.data) {
          const data = response.Blogs.data;
          if (data.length === 0) {
            if (page === 1) {
              this.blogsList = [];
            }
            this.hasMoreBlogs = false;
          } else {
            if (page === 1) {
              this.blogsList = data;
            } else {
              const existingIds = new Set(this.blogsList.map((b) => b.id));
              const newBlogs = data.filter((b: any) => !existingIds.has(b.id));
              this.blogsList = [...this.blogsList, ...newBlogs];
            }
            this.currentPage = page;
            if (data.length < 20) {
              this.hasMoreBlogs = false;
            }
          }
        } else {
          this.hasMoreBlogs = false;
          if (page === 1) {
            this.blogsList = [];
          }
        }
        this.loadingBlogs = false;
        this.initialLoadDone = true;
      },
      error: (err) => {
        this.loadingBlogs = false;
        this.initialLoadDone = true;
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch blogs list',
        });
      },
    });
  }

  // Handle search input changes with debounce
  private searchDebounceTimer: any;
  onSearchChange(rule: RedirectRule) {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.blogsList = [];
      this.currentPage = 1;
      this.hasMoreBlogs = true;
      this.fetchBlogs(1, rule.searchQuery);
    }, 400);
  }

  // Handle scroll event on any dropdown list
  onDropdownScroll(event: Event, rule: RedirectRule) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 15) {
      if (this.hasMoreBlogs && !this.loadingBlogs) {
        this.fetchBlogs(this.currentPage + 1, rule.searchQuery);
      }
    }
  }

  // Toggle selection of a blog in a specific rule
  toggleBlogSelection(rule: RedirectRule, blog: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const index = rule.selectedBlogs.findIndex((b) => b.id === blog.id);
    if (index > -1) {
      rule.selectedBlogs.splice(index, 1);
    } else {
      rule.selectedBlogs.push(blog);
    }
  }

  isBlogSelected(rule: RedirectRule, blog: any): boolean {
    return rule.selectedBlogs.some((b) => b.id === blog.id);
  }

  removeSelectedBlog(rule: RedirectRule, blogId: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    rule.selectedBlogs = rule.selectedBlogs.filter((b) => b.id !== blogId);
  }

  // Toggle open state of dropdown
  toggleDropdown(rule: RedirectRule, event: Event) {
    event.stopPropagation();
    const currentState = rule.isDropdownOpen;
    // Close all other dropdowns
    this.redirectRules.forEach((r) => (r.isDropdownOpen = false));
    rule.isDropdownOpen = !currentState;

    if (rule.isDropdownOpen) {
      // Reload matching blogs list for this dropdown query
      this.blogsList = [];
      this.currentPage = 1;
      this.hasMoreBlogs = true;
      this.fetchBlogs(1, rule.searchQuery);
    }
  }

  // Close all dropdowns when clicking anywhere outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown-container')) {
      this.redirectRules.forEach((rule) => (rule.isDropdownOpen = false));
    }
  }

  // Add a new blank rule row
  addRule() {
    this.redirectRules.push({
      selectedBlogs: [],
      toSlug: '',
      isDropdownOpen: false,
      searchQuery: '',
    });
  }

  // Remove a rule row
  removeRule(index: number) {
    if (this.redirectRules.length > 1) {
      this.redirectRules.splice(index, 1);
    } else {
      // Clear the only remaining rule
      this.redirectRules[0] = {
        selectedBlogs: [],
        toSlug: '',
        isDropdownOpen: false,
        searchQuery: '',
      };
    }
  }

  // Validate inputs and submit
  submitRedirects() {
    // 1. Validation
    const validRules = this.redirectRules.filter(
      (rule) => rule.selectedBlogs.length > 0 && rule.toSlug.trim() !== ''
    );

    if (validRules.length === 0) {
      this._MessageService.add({
        severity: 'warn',
        summary: 'Validation Alert',
        detail: 'Please configure at least one complete rule with selected blogs and a target slug.',
      });
      return;
    }

    // Prepare payload
    const payload = validRules.map((rule) => ({
      from: rule.selectedBlogs.map((b) => b.id),
      to: rule.toSlug.trim(),
    }));

    this.isSaving = true;
    this._NgxSpinnerService.show('square-jelly-box');

    this._BlogsService.updateSlugToAr(payload).subscribe({
      next: (response) => {
        this.isSaving = false;
        this._NgxSpinnerService.hide('square-jelly-box');
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'SEO Redirects updated successfully!',
        });

        // Reset/Clear rules list
        this.redirectRules = [{
          selectedBlogs: [],
          toSlug: '',
          isDropdownOpen: false,
          searchQuery: '',
        }];
      },
      error: (err) => {
        this.isSaving = false;
        this._NgxSpinnerService.hide('square-jelly-box');
        this._MessageService.add({
          severity: 'error',
          summary: 'Submission Error',
          detail: err.error?.message || 'Failed to submit redirects payload.',
        });
      },
    });
  }
}
