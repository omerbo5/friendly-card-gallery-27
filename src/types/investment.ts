export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export type InvestmentTrack = 'SPY500' | 'NASDAQ100' | 'VTI';

export interface Client {
  id: string;
  name: string;
  profession: string;
  customProfession?: string;
  investmentTrack: InvestmentTrack;
  monthlyData: MonthlyData[];
  monthlyExpenses: number;
  investmentPercentage: string;
}

export interface Metrics {
  latestMonthlyInvestment: number;
  currentValue: number;
}

export interface ClientMetrics {
  totalInvestment: number;
  portfolioValue: number;
  totalProfit: number;
  latestMonthlyInvestment: number;
  managementFee: number;
  currentValue: number;
}

export interface AggregateMetrics {
  totalValue: number;
  totalInvestment: number;
  totalProfit: number;
  totalClients: number;
}

export interface ChartDataPoint {
  x: string | number;
  y: number;
}

export interface ChartSeries {
  id: string;
  data: ChartDataPoint[];
}

export interface VisibleSeries {
  portfolioValue: boolean;
  investment: boolean;
  profit: boolean;
}