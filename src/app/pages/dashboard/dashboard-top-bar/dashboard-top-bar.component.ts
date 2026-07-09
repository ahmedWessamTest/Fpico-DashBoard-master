import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DashboardLayoutService } from '../../../core/services/dashboard/core/dashboard-layout.service';
import { RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-dashboard-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SidebarModule,
    InputTextModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
  ],
  templateUrl: './dashboard-top-bar.component.html',
  styleUrl: './dashboard-top-bar.component.scss',
})
export class DashboardTopBarComponent {
  @Input() isShow: boolean = true;

  items!: MenuItem[];
  name: string = '';

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: DashboardLayoutService,
  ) { }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user') || '');
    if (user.role == 'admin') {
      // this.name = 'سلمان بن أحمد العيد';
    }

  }
}
