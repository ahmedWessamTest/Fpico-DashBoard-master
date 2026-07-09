import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { BlogsService } from "../services/dashboard/content/blogs.service";
import { finalize, timer } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { IGetBlogById } from "../interfaces/dashboard/blogs/IGetBlogById";

export const blogsDetailsResolver: ResolveFn<boolean | IGetBlogById> = (route, state) => {
  const blogsService = inject(BlogsService);

  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show("square-jelly-box");
  return blogsService.getBlogById(route.paramMap.get("id")!).pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("square-jelly-box"));
    })
  );
};
