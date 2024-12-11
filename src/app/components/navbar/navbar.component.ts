import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  themeService: ThemeService = new ThemeService();
  sideBarOpen = true;
  @Output() menuClicked: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.themeService.sideBarOpen$.subscribe((isOpen) => {
      this.sideBarOpen = isOpen;
    });
  }

  toggleSideBar(): void {
    this.themeService.toggleSideBar();
    this.menuClicked.emit();
  }
  navItems: { item: string; link: string; icon: string }[] = [
    {
      item: 'Dashboard',
      link: '/',
      icon: 'fa-solid fa-house',
    },
    {
      item: 'Expense List',
      link: '/expense-list',
      icon: 'fa-solid fa-list',
    },
    {
      item: 'Add Expense',
      link: '/add-expense',
      icon: 'fa-solid fa-plus',
    },
  ];
}
