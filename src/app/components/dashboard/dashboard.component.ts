import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartType,
  LabelItem,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartModule } from 'primeng/chart';
import { ExpenseService } from '../../services/expense.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, BaseChartDirective, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  totalIncome: number = 0;
  totalExpense: number = 0;
  totalSavings: number = 0;
  incomePercentage: number = 0;
  expensePercentage: number = 0;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = []; // Declare as public
  public barChartData: ChartDataset[] = [{ data: [], label: 'Amount' }];

  // Line Chart
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartLabels: string[] = []; // Declare as public
  public lineChartData: ChartDataset[] = [
    { data: [], label: 'Income' },
    { data: [], label: 'Expense' },
  ];

  // Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = []; // Declare as public
  public pieChartData: ChartDataset[] = [
    {
      data: [],
      backgroundColor: ['#42A5F5', '#FF6384'],
    },
  ];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.fetchExpenseData();
  }

  private fetchExpenseData(): void {
    this.expenseService.getExpensesFromApi().subscribe((data) => {
      const incomeData = data.filter((expense) => expense.type === 'income');
      const expenseData = data.filter((expense) => expense.type === 'expense');

      const income = incomeData.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const expense = expenseData.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      this.totalIncome = income;
      this.totalExpense = expense;
      this.totalSavings = income - expense;

      // Calculate percentages
      const total = this.totalIncome + this.totalExpense;
      this.incomePercentage = total ? (this.totalIncome / total) * 100 : 0;
      this.expensePercentage = total ? (this.totalExpense / total) * 100 : 0;

      // Bar Chart
      this.barChartLabels = ['Income', 'Expense'];
      this.barChartData = [{ data: [income, expense], label: 'Amount' }];

      // Line Chart
      const labels = data.map((expense) => expense.description);
      this.lineChartLabels = labels;
      this.lineChartData[0].data = incomeData.map((expense) => expense.amount);
      this.lineChartData[1].data = expenseData.map((expense) => expense.amount);

      // Pie Chart
      this.pieChartLabels = ['Income', 'Expense'];
      this.pieChartData[0].data = [income, expense];
    });
  }
}
