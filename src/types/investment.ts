export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';

export interface Client {
  id: number;
  name: string;
  profession: string;
  riskProfile: RiskProfile;
  monthlyData: MonthlyData[];
}

export interface ClientMetrics {
  totalInvestment: number;
  portfolioValue: number;
  totalProfit: number;
  latestMonthlyInvestment: number;
  managementFee: number;
}

export interface AggregateMetrics {
  totalValue: number;
  totalInvestment: number;
  totalProfit: number;
  totalClients: number;
}