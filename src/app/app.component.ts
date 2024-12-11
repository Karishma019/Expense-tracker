import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app';
  sideBarOpen: boolean = false;

  constructor(private themeService: ThemeService) {
    this.themeService.sideBarOpen$.subscribe((isOpen) => {
      this.sideBarOpen = isOpen;
    });
  }

  getValue(): void {
    this.themeService.toggleSideBar();
  }

  // Subscribe to sidebar state changes

  ngOnInit(): void {
    this.themeService.applyTheme(); // Apply theme on app load
  }
}
