import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingDataBannerComponent } from '../../../../shared/components/loading-data-banner/loading-data-banner.component';
import { NoDataFoundBannerComponent } from '../../../../shared/components/no-data-found-banner/no-data-found-banner.component';
import { ContactUsService } from '../../../../core/services/dashboard/content/contact-us.service';
import { IContactUsMessage } from '../../../../core/interfaces/dashboard/contact-us/IContactUsMessages';

// import { IGetAllContactUsMessagesContact } from '../../../../../core/interfaces/IContactUs';
// import { ContactUsService } from '../../../../../core/services/content/contact-us.service';
// import { LoadingDataBannerComponent } from '../../../../../shared/components/loading-data-banner/loading-data-banner.component';
// import { NoDataFoundBannerComponent } from '../../../../../shared/components/no-data-found-banner/no-data-found-banner.component';

@Component({
  selector: 'app-dashboard-contact-us',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    CardModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    SlicePipe,
    LoadingDataBannerComponent,
    NoDataFoundBannerComponent,
  ],
  templateUrl: './dashboard-contact-us.component.html',
  styleUrl: './dashboard-contact-us.component.scss',
})
export class DashboardContactUsComponent {
  emails!: IContactUsMessage[];

  constructor(private _ContactUsService: ContactUsService) {}

  ngOnInit(): void {
    this._ContactUsService.getContactUs().subscribe({
      next: (response) => {
        this.emails = response.rows;
      },
    });
  }

  selectedEmail!: IContactUsMessage;
  emailDialogVisible: boolean = false;

  showDetails(email: IContactUsMessage) {
    this.selectedEmail = email;
    this.emailDialogVisible = true;
  }

  // Filter table by name
  onGlobalFilter(table: any, event: any): void {
    table.filterGlobal(event.target.value, 'contains');
  }
}
