import React from 'react';
import { HelpCircle, ArrowUpRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AggregateMetrics } from '@/types/investment';

interface MetricsPanelProps {
  metrics: AggregateMetrics;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const MetricsPanel = ({ metrics, formatCurrency, formatPercentage }: MetricsPanelProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
      <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xs md:text-sm text-muted-foreground">Total Portfolio Value</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The total value of all client portfolios combined</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-lg md:text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
        <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
          <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
          <span>{formatPercentage(8.5)}</span>
        </div>
      </div>
      <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
        <h3 className="text-xs md:text-sm text-muted-foreground">Total Investment</h3>
        <div className="text-lg md:text-2xl font-bold">{formatCurrency(metrics.totalInvestment)}</div>
        <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
          <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
          <span>{formatPercentage(12.3)}</span>
        </div>
      </div>
      <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
        <h3 className="text-xs md:text-sm text-muted-foreground">Total Profit</h3>
        <div className="text-lg md:text-2xl font-bold">{formatCurrency(metrics.totalProfit)}</div>
        <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
          <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
          <span>{formatPercentage(15.7)}</span>
        </div>
      </div>
      <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
        <h3 className="text-xs md:text-sm text-muted-foreground">Total Clients</h3>
        <div className="text-lg md:text-2xl font-bold">{metrics.totalClients}</div>
        <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
          <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
          <span>{formatPercentage(5.2)}</span>
        </div>
      </div>
    </div>
  );
};