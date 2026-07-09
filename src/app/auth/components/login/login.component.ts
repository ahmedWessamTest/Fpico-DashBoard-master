import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";

import { ButtonModule } from "primeng/button";

import { PasswordModule } from "primeng/password";

import { Router } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { InputTextModule } from "primeng/inputtext";
import { DashboardFooterComponent } from "../../../pages/dashboard/dashboard-footer/dashboard-footer.component";
import { DashboardTopBarComponent } from "../../../pages/dashboard/dashboard-top-bar/dashboard-top-bar.component";
import { IUserData } from "../../interfaces/ILoninResponse";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    DashboardTopBarComponent,
    DashboardFooterComponent,
    DashboardTopBarComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  userData: FormGroup;

  isErrorMessage: boolean = false;

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private _Router: Router,
    private _ToastrService: ToastrService
  ) {
    this.userData = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.minLength(4)]),
      password: new FormControl("", [Validators.required, Validators.minLength(9)]),
      rememberMe: new FormControl(false),
    });
  }

  ngOnInit() {
    // Check if email is stored in localStorage
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      this.userData.controls["email"].setValue(savedEmail);
      this.userData.controls["rememberMe"].setValue(true);
    }

  }

  onSignInFormSubmitClick() {
    this.isErrorMessage = false;
    this.isLoading = true;
    if (this.userData.valid) {
      const { email, password, rememberMe } = this.userData.value;

      // Handle "Remember Me" functionality
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      let userData: IUserData = {
        email: `${email}@gmail.com`,
        password: password,
      };
      // Print form values
      this.authService.login(userData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.error) {
            this.isErrorMessage = true;
          }
          if (response.user) {
            this._ToastrService.success("Successfully logged in");
            localStorage.setItem("user", JSON.stringify(response.user));

            this._Router.navigate(["/dashboard"]);
          }
        },
      });
    }
  }
}
