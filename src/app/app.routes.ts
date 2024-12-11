import { Routes } from '@angular/router';
import { AddExpenseComponent } from './pages/add-expense/add-expense.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },

  {
    path: 'expense-list',
    loadComponent: () =>
      import('./pages/expense-list/expense-list.component').then(
        (m) => m.ExpenseListComponent
      ),
  },

  {
    path: 'add-expense',
    component: AddExpenseComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
