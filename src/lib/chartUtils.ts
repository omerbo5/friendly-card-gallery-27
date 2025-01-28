import { MonthlyData } from '@/types/investment';

export const formatChartData = (monthlyData: MonthlyData[] | undefined) => {
  if (!monthlyData) return [];

  return [
    {
      id: 'Portfolio Value',
      data: monthlyData.map((data) => ({
        x: data.month,
        y: data.portfolioValue,
      })),
    },
    {
      id: 'Monthly Investment',
      data: monthlyData.map((data) => ({
        x: data.month,
        y: data.investment,
      })),
    },
    {
      id: 'Cumulative Profit',
      data: monthlyData.map((data) => ({
        x: data.month,
        y: data.profit,
      })),
    },
  ];
};