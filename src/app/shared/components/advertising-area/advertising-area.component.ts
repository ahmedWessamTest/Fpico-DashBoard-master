import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-advertising-area',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './advertising-area.component.html',
  styleUrl: './advertising-area.component.scss',
})
export class AdvertisingAreaComponent {
  @Input() positionClasses: string = '';
  @Input() imageWidth: string = '220px';
}
