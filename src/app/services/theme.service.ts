import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme = false;
  public sideBarOpen = new BehaviorSubject<boolean>(true);
  sideBarOpen$ = this.sideBarOpen.asObservable();

  toggleSideBar(): void {
    this.sideBarOpen.next(!this.sideBarOpen.value);
  }

  setSideBarState(isOpen: boolean): void {
    this.sideBarOpen.next(isOpen);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
  }

  applyTheme(): void {
    if (this.isDarkTheme) {
      document.body.style.backgroundColor = '#212529';
      document.body.style.color = '#f5f5f5';
    } else {
      document.body.style.backgroundColor = '#f5f5f5';
      document.body.style.color = '#212529';
    }
  }

  // Check if dark theme is active
  isDark(): boolean {
    return this.isDarkTheme;
  }
}
