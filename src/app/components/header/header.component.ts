import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, CalendarModule, ToggleButtonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  checked: boolean = false;
  themeService: ThemeService = new ThemeService();

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
