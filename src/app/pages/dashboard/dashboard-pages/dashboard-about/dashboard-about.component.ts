import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { IAboutUs } from '../../../../core/interfaces/dashboard/about-us/IAbouUs';
import { AboutUsService } from '../../../../core/services/dashboard/content/about-us.service';

@Component({
  selector: 'app-dashboard-about',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    MessagesModule,
    EditorModule,
  ],
  templateUrl: './dashboard-about.component.html',
  styleUrl: './dashboard-about.component.scss',
  providers: [MessageService],
})
export class DashboardAboutComponent {
  isEditing: boolean = false;
  aboutUsContent!: IAboutUs;

  constructor(
    private _AboutUsService: AboutUsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._AboutUsService.getAboutUs().subscribe({
      next: (response) => {
        this.aboutUsContent = response;
      },
    });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    this._AboutUsService.updateAboutUs(this.aboutUsContent.rows).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Changes saved successfully',
        });
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error saving changes', err);
      },
    });
  }
}
