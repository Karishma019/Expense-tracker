import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../models/Expense';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  http = inject(HttpClient);
  readonly url = 'http://localhost:3000';
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

  addExpense(expense: Expense) {
    const updatedExpenses = [...this.expensesSubject.value, expense];
    this.expensesSubject.next(updatedExpenses);
    console.log(this.expensesSubject, this.expenses$);
  }

  getExpenses(): Expense[] {
    return this.expensesSubject.value;
  }

  addExpenses(data: Expense) {
    return this.http.post(`${this.url}/expenses`, data);
  }

  updateExpense(id: string | undefined, data: Expense) {
    return this.http.put(`${this.url}/expenses/${id}`, data);
  }

  getExpensesFromApi() {
    return this.http.get<Array<Expense>>(`${this.url}/expenses`);
  }
  deleteExpense(id: string | undefined) {
    console.log('from serivces..');
    return this.http.delete(`${this.url}/expenses/${id}`);
  }
}
