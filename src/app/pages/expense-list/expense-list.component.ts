import { Component, inject, OnInit } from '@angular/core';
import { Expense } from '../../models/Expense';
import { ExpenseService } from '../../services/expense.service';
import { catchError, Subject, takeUntil } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { LoadingComponent } from '../../components/loading/loading.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expense-list',
  imports: [TableModule, CommonModule, CalendarModule, LoadingComponent],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css',
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];
  expenseSerivce = inject(ExpenseService);
  loading: boolean = false;
  toaster = inject(ToastrService);
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.expenseSerivce
      .getExpensesFromApi()
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.toaster.error('There is some error');
          throw err;
        })
      )
      .subscribe((data) => {
        this.loading = false;
        this.expenses = [...data];
        console.log(this.expenses);
      });
  }

  filterTable(event: Event, table: any) {
    const inputElement = event.target as HTMLInputElement;
    table.filterGlobal(inputElement.value, 'contains');
  }

  onEdit(expense: any): void {
    this.router.navigateByUrl('/add-expense', {
      state: { expenseData: expense },
    });
    // Implement your edit logic here
  }

  onDelete(id: string | undefined): void {
    this.expenses = this.expenses.filter((record) => record.id !== id);
    this.expenseSerivce
      .deleteExpense(id)
      .pipe(
        catchError((err) => {
          this.toaster.error(err);
          throw err;
        })
      )
      .subscribe(() => this.toaster.success('Deleted successfully'));
  }
}
