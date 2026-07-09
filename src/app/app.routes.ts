import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { blogsDetailsResolver } from './core/resolvers/blogs-details.resolver';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/components/login/login.component').then(
            (c) => c.LoginComponent
          ),
        data: {
          title: 'FPICO - login',
          description: 'Login Page',
        },
      },
    ],
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./core/layouts/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
    canActivate: [loginGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/dashboard/dashboard-pages/dashboard-pages.component'
          ).then((c) => c.DashboardPagesComponent),
        data: {
          title: 'FPICO - Dashboard',
          description: 'Dashboard Page',
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-welcome/dashboard-welcome.component'
              ).then((c) => c.DashboardWelcomeComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // social-links
          {
            path: 'social-links',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-social-links/dashboard-social-links.component'
              ).then((c) => c.DashboardSocialLinksComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // clients
          {
            path: 'clients',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-clients/dashboard-clients.component'
              ).then((c) => c.DashboardClientsComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          /* Youtube Slider */
          {
            path: 'youtube-slider',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-youtube-slider/dashboard-youtube-slider.component'
              ).then((c) => c.DashboardYoutubeSliderComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // partners
          {
            path: 'partners',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-partners/dashboard-partners.component'
              ).then((c) => c.DashboardPartnersComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // chairman-message
          {
            path: 'chairman-message',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-charman-message/dashboard-charman-message.component'
              ).then((c) => c.DashboardCharmanMessageComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // contact-us
          {
            path: 'contact-us',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-contact-us/dashboard-contact-us.component'
              ).then((c) => c.DashboardContactUsComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // about-us
          {
            path: 'about-us',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-about/dashboard-about.component'
              ).then((c) => c.DashboardAboutComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // why-us
          {
            path: 'why-us',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-why-us/dashboard-why-us.component'
              ).then((c) => c.DashboardWhyUsComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // projects
          {
            path: 'projects',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-projects/dashboard-projects.component'
              ).then((c) => c.DashboardProjectsComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // features
          {
            path: 'features',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-features/dashboard-features.component'
              ).then((c) => c.DashboardFeaturesComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // services
          {
            path: 'blogs',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-blogs/dashboard-blogs.component'
              ).then((c) => c.DashboardBlogsComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
            children: [
              { path: '', redirectTo: 'blogs-index', pathMatch: 'full' },
              {
                path: 'blogs-index',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/dashboard-blogs/all-blogs/all-blogs.component'
                  ).then((c) => c.AllBlogsComponent),
                data: {
                  title: 'FPICO - Dashboard',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'blogs-add',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/dashboard-blogs/blogs-add/blogs-add.component'
                  ).then((c) => c.BlogsAddComponent),
                data: {
                  title: 'FPICO - Dashboard',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'blogs-edit/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/dashboard-blogs/blogs-add/blogs-add.component'
                  ).then((c) => c.BlogsAddComponent),
                resolve: { blogDetails: blogsDetailsResolver },
                data: {
                  title: 'FPICO - Dashboard',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'blogs-details/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/dashboard-blogs/blogs-details/blogs-details.component'
                  ).then((c) => c.BlogsDetailsComponent),
                data: {
                  title: 'FPICO - Dashboard',
                  description: 'Dashboard Page',
                },
              },
            ],
          },
          // services
          {
            path: 'services',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-services/dashboard-services.component'
              ).then((c) => c.DashboardServicesComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          {
            path: 'services/add',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-services/services-add/services-add.component'
              ).then((c) => c.ServicesAddComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          {
            path: 'services/edit/:id',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-services/services-add/services-add.component'
              ).then((c) => c.ServicesAddComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // seo-redirects
          {
            path: 'seo-redirects',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/dashboard-redirects/dashboard-redirects.component'
              ).then((c) => c.DashboardRedirectsComponent),
            data: {
              title: 'FPICO - Dashboard',
              description: 'Dashboard Page',
            },
          },
          // {
          //   path: 'aggregation-systems',
          //   loadComponent: () =>
          //     import(
          //       './pages/dashboard/dashboard-pages/dashboard-aggreagation-systems/dashboard-aggreagation-systems.component'
          //     ).then((c) => c.DashboardAggreagationSystemsComponent),
          //   data: {
          //     title: 'FPICO - Dashboard',
          //     description: 'Dashboard Page',
          //   },
          // },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/main/not-found/not-found.component').then(
        (e) => e.NotFoundComponent
      ),
    data: { title: 'Not Found Page' },
  },
];
