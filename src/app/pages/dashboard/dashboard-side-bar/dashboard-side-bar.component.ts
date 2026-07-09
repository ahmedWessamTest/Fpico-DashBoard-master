import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { finalize, timer } from 'rxjs';
import { User } from '../../../auth/interfaces/ILoninResponse';
import { DashboardLayoutService } from '../../../core/services/dashboard/core/dashboard-layout.service';
import { DashboardMenuItemsComponent } from '../dashboard-menu-items/dashboard-menu-items.component';

@Component({
  selector: 'app-dashboard-side-bar',
  standalone: true,
  imports: [ConfirmDialogModule, DashboardMenuItemsComponent, ToastModule],
  templateUrl: './dashboard-side-bar.component.html',
  styleUrl: './dashboard-side-bar.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class DashboardSideBarComponent implements OnInit {
  _MessageService = inject(MessageService);

  model: any[] = [];
  constructor(
    public layoutService: DashboardLayoutService,
    public el: ElementRef,
    private _Router: Router,
    private _ConfirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    let currentRole!: User;

      currentRole = JSON.parse(localStorage.getItem('user') || '');
      this.model = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home', // Home Icon
          items: [
            {
              label: 'Welcome',
              icon: 'pi pi-star', // A welcoming star icon
              routerLink: ['/dashboard'],
            },
          ],
        },
        {
          label: 'Blogs',
          items: [
            {
              label: 'Manage Blogs',
              icon: 'pi pi-fw pi-book',
              routerLink: ['/dashboard/blogs/blogs-index'],
            },
            {
              label: 'Add New Blogs',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/dashboard/blogs/blogs-add'],
            },
          ],
        },
        {
          label: 'Projects',
          icon: 'pi pi-folder-open', // Folder icon
          items: [
            {
              label: 'Projects',
              icon: 'pi pi-briefcase',
              routerLink: ['/dashboard/projects'],
            },
          ],
        },
        {
          label: 'Features',
          icon: 'pi pi-folder-open', // Folder icon
          items: [
            {
              label: 'Features',
              icon: 'pi pi-sparkles',
              routerLink: ['/dashboard/features'],
            },
          ],
        },
        {
          label: 'Services',
          icon: 'pi pi-cog', // Settings icon to indicate services
          items: [
            {
              label: 'Services',
              icon: 'pi pi-server',
              routerLink: ['/dashboard/services'],
            },
          ],
        },
        {
          label: 'Youtube Slider',
          icon: 'pi pi-youtube',
          items: [
            {
              label: 'Youtube Slider',
              icon: 'pi pi-youtube',
              routerLink: ['/dashboard/youtube-slider'],
            },
          ],
        },
        // {
        //   label: 'Irrigation System',
        //   icon: 'pi pi-th-large',
        //   items: [
        //     {
        //       label: 'Irrigation',
        //       icon: 'pi pi-clone',
        //       routerLink: ['/dashboard/aggregation-systems'],
        //     },
        //   ],
        // },
        {
          label: 'Chairman Message',
          icon: 'pi pi-user-edit',
          items: [
            {
              label: 'Chairman Message',
              icon: 'pi pi-comment',
              routerLink: ['/dashboard/chairman-message'],
            },
          ],
        },
        {
          label: 'Partners & Clients',
          icon: 'pi pi-users', // People icon for clients & partners
          items: [
            {
              label: 'Partners',
              icon: 'pi pi-users',
              routerLink: ['/dashboard/partners'],
            },
            {
              label: 'Clients',
              icon: 'pi pi-user',
              routerLink: ['/dashboard/clients'],
            },
          ],
        },
        {
          label: 'Contact & Social',
          icon: 'pi pi-phone', // Contact icon
          items: [
            {
              label: 'Social Links',
              icon: 'pi pi-share-alt',
              routerLink: ['/dashboard/social-links'],
            },
            {
              label: 'Contact Us',
              icon: 'pi pi-fw pi-envelope',
              routerLink: ['/dashboard/contact-us'],
            },
          ],
        },
        {
          label: 'About & Why Us',
          icon: 'pi pi-info-circle', // General Info Icon
          items: [
            {
              label: 'About Section',
              icon: 'pi pi-book',
              routerLink: ['/dashboard/about-us'],
            },
            {
              label: 'Why Us Section',
              icon: 'pi pi-thumbs-up',
              routerLink: ['/dashboard/why-us'],
            },
          ],
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog', // Settings Icon
          items: [
            {
              label: 'Update Sitemap',
              icon: 'pi pi-sync', // A welcoming star icon
              command: () => this.updateSiteMap(),
            },
            {
              label: 'Dashboard Settings',
              icon: 'pi pi-sliders-h',
            },
            {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              command: () => this.logout(),
            },
          ],
        },
      ];
  }

  http = inject(HttpClient);

  ngxSpinnerService = inject(NgxSpinnerService);

  updateSiteMap() {
    this.ngxSpinnerService.show('square-jelly-box');
    this.http
      .get('https://fpico.org/sitmaprenders/')
      .pipe(
        finalize(() => {
          timer(200).subscribe(() => {
            this.ngxSpinnerService.hide('square-jelly-box');

            this._MessageService.add({
              severity: 'success',
              summary: 'Sitemap Updated',
              detail: 'Sitemap Has Been Updated Successfully!',
            });
          });
        })
      )
      .subscribe();
  }

  logout(): void {
    this._ConfirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'No',
      acceptLabel: 'Yes',
      closeOnEscape: true,
      acceptButtonStyleClass: 'p-button-danger mx-2',

      accept: () => {
        localStorage.removeItem('user');
        this._Router.navigate(['/login']);
      },
      reject: () => {},
    });
  }
}
