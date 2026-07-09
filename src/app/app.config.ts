import { ApplicationConfig } from "@angular/core";
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from "@angular/router";

import { IMAGE_CONFIG } from "@angular/common";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";

import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { routes } from "./app.routes";
import { loadingSpinnerInterceptor } from "./core/interceptors/loading-spinner.interceptor";
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: "top",
  anchorScrolling: "enabled",
};

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature, withViewTransitions()),
    provideAnimations(),
    provideToastr({
      positionClass: "toast-top-left",
      timeOut: 2000,
    }),
    provideHttpClient(withInterceptors([loadingSpinnerInterceptor]), withFetch()),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
  ],
};
