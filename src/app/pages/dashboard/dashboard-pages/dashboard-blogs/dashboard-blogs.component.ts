import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-dashboard-blogs",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./dashboard-blogs.component.html",
  styleUrl: "./dashboard-blogs.component.scss",
})
export class DashboardBlogsComponent {}
