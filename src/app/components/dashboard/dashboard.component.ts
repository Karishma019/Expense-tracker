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
  monthlyData: { [month: string]: { income: number; expense: number } } = {};

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
    {
      data: [],
      label: 'Income',
      // backgroundColor: ['#2196f3'],
    },
    {
      data: [],
      label: 'Expense',
      // backgroundColor: ['#ff8c8c'],
    },
  ];

  public doughChartOption: ChartOptions = {
    responsive: true,
  };
  public doughnutChartLabels: string[] = []; // Declare as public
  public doughnutChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Income',
      backgroundColor: ['#2196f3', '#ec4899', '#b6ea9e', '#4caf50', '#66d8e2'],
    },
    {
      data: [],
      label: 'Expense',
      backgroundColor: [
        '#ff8c8c',
        '#66d8e2',
        '#4caf50',
        '#b9ba11',
        '#b9ba11',
        '#eaff00',
        '#eab99e',
        '#e69eea',
      ],
    },
  ];

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

      const total = this.totalIncome + this.totalExpense;
      this.incomePercentage = total ? (this.totalIncome / total) * 100 : 0;
      this.expensePercentage = total ? (this.totalExpense / total) * 100 : 0;

      this.barChartLabels = ['Income', 'Expense'];
      this.barChartData = [{ data: [income, expense], label: 'Amount' }];

      // doughNut Chart
      const doughnutLabels = data.map((expense) => expense.category);
      this.doughnutChartLabels = doughnutLabels.filter(
        (label, index) => index < 5
      );
      this.doughnutChartData[0].data = incomeData.map(
        (expense) => expense.amount
      );
      this.doughnutChartData[1].data = expenseData.map(
        (expense) => expense.amount
      );

      // Pie Chart
      this.pieChartLabels = ['Income', 'Expense'];
      this.pieChartData[0].data = [income, expense];

      data.forEach((entry) => {
        const date = new Date(entry.date);
        const month = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        const monthF = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          year: 'numeric',
        }).format(date);

        if (!this.monthlyData[monthF]) {
          this.monthlyData[monthF] = { income: 0, expense: 0 };
        }
        if (entry.type === 'income') {
          this.monthlyData[monthF].income += entry.amount;
        } else {
          this.monthlyData[monthF].expense += entry.amount;
        }
      });
      const lineLabels = Object.keys(this.monthlyData).reverse();
      const incomeLineData = lineLabels.map(
        (label) => this.monthlyData[label].income
      );
      const expenseLineData = lineLabels.map(
        (label) => this.monthlyData[label].expense
      );

      this.lineChartLabels = lineLabels;
      this.lineChartData[0].data = incomeLineData;
      this.lineChartData[1].data = expenseLineData;
      console.log(
        this.lineChartData,
        this.lineChartLabels,
        this.lineChartOptions
      );
    });
  }
}
