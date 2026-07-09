import { Component, inject } from '@angular/core';
import { MessageService as ms } from '../../../../core/services/dashboard/content/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxJoditComponent } from 'ngx-jodit';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { IMessageMaster } from '../../../../core/interfaces/dashboard/message/IMessageMaster';
import { MessageService } from 'primeng/api';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-dashboard-charman-message',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafeHtmlPipe,
    ToastModule,
    ButtonModule,
    MessagesModule,
    EditorModule,
    NgxJoditComponent,
    LoadingDataBannerComponent,
  ],
  templateUrl: './dashboard-charman-message.component.html',
  styleUrl: './dashboard-charman-message.component.scss',
  providers: [MessageService],
})
export class DashboardCharmanMessageComponent {
  masterMessageService = inject(ms);

  isEditing: boolean = false;
  aboutUsContent!: IMessageMaster;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.masterMessageService.getMasterMessage().subscribe({
      next: (response) => {
        this.aboutUsContent = response;
      },
    });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    let fd = new FormData();
    Object.keys(this.aboutUsContent.rows[0]).forEach((key) => {
      let data = { ...this.aboutUsContent.rows[0] } as any;
      fd.append(key, data[key] as any);
    });

    this.masterMessageService.updateMasterMessage(fd).subscribe({
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
