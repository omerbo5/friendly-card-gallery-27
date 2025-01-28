import { Client, ClientMetrics } from '@/types/investment';

export const calculateMetrics = (client: Client): ClientMetrics => {
  if (!client.monthlyData || client.monthlyData.length === 0) {
    return {
      totalInvestment: 0,
      portfolioValue: 0,
      totalProfit: 0,
      latestMonthlyInvestment: 0,
      managementFee: 0,
      currentValue: 0
    };
  }

  const lastMonth = client.monthlyData[client.monthlyData.length - 1];
  return {
    totalInvestment: client.monthlyData.reduce((sum, data) => sum + data.investment, 0),
    portfolioValue: lastMonth.portfolioValue,
    totalProfit: lastMonth.profit,
    latestMonthlyInvestment: lastMonth.investment,
    managementFee: client.monthlyData.reduce((sum, data) => sum + data.investment, 0) * 0.005,
    currentValue: lastMonth.portfolioValue
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};