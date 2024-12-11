import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Expense } from '../../models/Expense';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ExpenseService } from '../../services/expense.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LoadingComponent } from '../../components/loading/loading.component';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterState,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-expense',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CalendarModule,
    SelectButtonModule,
    LoadingComponent,
  ],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css',
})
export class AddExpenseComponent implements OnInit {
  loading: boolean = false;
  editMode: boolean = false;
  value: string = 'expense';
  toaster = inject(ToastrService);
  router = inject(Router);
  stateOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  expenseService: ExpenseService = new ExpenseService();

  expenseForm: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    amount: new FormControl('', [
      Validators.required,
      this.greaterThanZeroValidator,
    ]),
    category: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required, this.futureDateValidator]),
  });

  ngOnInit(): void {
    const data = history.state?.expenseData;
    if (data != null && data != undefined) {
      this.editMode = true;
      this.expenseForm.patchValue({
        description: data.description || '',
        amount: data.amount || '',
        category: data.category || '',
        type: data.type || '',
        date: data.date || '',
      });

      console.log(this.expenseForm.value, this.editMode);
    }
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate < today ? null : { futureDate: true };
  }

  greaterThanZeroValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value <= 0) {
        return { greaterThanZero: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.loading = true; // Set loading to true before submission
      const expense: Expense = this.expenseForm.value;
      if (this.editMode) {
        this.expenseService
          .updateExpense(history.state?.expenseData?.id, expense)
          .subscribe(
            () => {
              this.loading = false;
              this.expenseForm.reset();
              this.toaster.success('Edited expense successfully');
              this.router.navigateByUrl('/expense-list');
            },
            (error) => {
              this.toaster.error('There is some error');
              this.loading = false; // Reset loading if there's an error
              console.error(error); // Handle error as necessary
            }
          );
      } else {
        this.expenseService.addExpenses(expense).subscribe(
          () => {
            this.loading = false;
            this.expenseForm.reset();
            this.toaster.success('Added expense successfully');
            this.router.navigateByUrl('/expense-list');
          },
          (error) => {
            this.toaster.error('There is some error');
            this.loading = false; // Reset loading if there's an error
            console.error(error); // Handle error as necessary
          }
        );
      }
    }
  }
}
