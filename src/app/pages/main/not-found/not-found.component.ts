import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DashboardFooterComponent } from "../../dashboard/dashboard-footer/dashboard-footer.component";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [RouterLink, DashboardFooterComponent],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
})
export class NotFoundComponent {}
