import { afterNextRender, Component, HostListener, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { timer } from "rxjs";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  providers: [],
})
export class AppComponent {
  title = "Asdaa-el-khaleeg";

  ngxSpinnerService = inject(NgxSpinnerService);
  Title = inject(Title);
  Meta = inject(Meta);
  router = inject(Router);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        document.querySelector(".lightBox")?.classList.add("d-none");
      }, 2000);
    });
  }
  ngOnInit(): void {
    this.ngxSpinnerService.show();

  }
  @HostListener("window:load")
  onWindowLoad() {
    timer(1000).subscribe(() => this.ngxSpinnerService.hide());
  }
}
