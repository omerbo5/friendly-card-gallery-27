import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Search } from 'lucide-react';
import { Client } from '@/types/investment';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { INVESTMENT_TRACKS, PROFESSIONS, SP500_RETURNS, NASDAQ_RETURNS, generateRandomName } from '@/lib/constants';
import PerformanceChart from '@/components/PerformanceChart';
import { ClientCard } from './ClientCard';
import { MetricsPanel } from './MetricsPanel';
import { ChartControls } from './ChartControls';
import { calculateMetrics, formatCurrency, formatPercentage } from '@/lib/clientUtils';
import { getClientsFromSupabase, saveClientsToSupabase, searchClientsInSupabase } from '@/lib/supabaseUtils';
import { generateMonthlyData } from '@/lib/utils';
import { formatChartData } from '@/lib/chartUtils';

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [comparisonClient, setComparisonClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState({
    portfolioValue: true,
    investment: true,
    profit: true
  });
  const [investmentPercentage, setInvestmentPercentage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredClientsList, setFilteredClientsList] = useState<Client[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        const storedClients = await getClientsFromSupabase();
        if (storedClients.length === 0) {
          await generateClients();
        } else {
          setClients(storedClients);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  useEffect(() => {
    const updateFilteredClients = async () => {
      if (searchTerm) {
        const results = await searchClientsInSupabase(searchTerm);
        setFilteredClientsList(results);
      } else {
        setFilteredClientsList(clients);
      }
    };
    updateFilteredClients();
  }, [searchTerm, clients]);

  const generateClients = async () => {
    const newClients: Client[] = Array.from({ length: 100 }, (_, i) => {
      const monthlyExpenses = Math.floor(Math.random() * 16000) + 4000;
      const investmentPercentage = (Math.random() * 17 + 3).toFixed(1);
      const tracks = INVESTMENT_TRACKS.map(track => track.id);
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      
      return {
        id: (i + 1).toString(),
        name: generateRandomName(),
        profession: PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)],
        investmentTrack: randomTrack,
        monthlyData: generateMonthlyData({ 
          investmentPercentageOverride: Number(investmentPercentage), 
          investmentTrack: randomTrack 
        }),
        monthlyExpenses,
        investmentPercentage
      };
    });

    await saveClientsToSupabase(newClients);
    setClients(newClients);
  };

  const aggregateMetrics = clients.reduce((acc, client) => {
    const metrics = calculateMetrics(client);
    return {
      totalValue: acc.totalValue + metrics.portfolioValue,
      totalInvestment: acc.totalInvestment + metrics.totalInvestment,
      totalProfit: acc.totalProfit + metrics.totalProfit,
      totalClients: clients.length
    };
  }, { totalValue: 0, totalInvestment: 0, totalProfit: 0, totalClients: 0 });

  const handleInvestmentPercentageChange = async (value: number[]) => {
    setInvestmentPercentage(value[0]);
    const updatedClients = clients.map(client => ({
      ...client,
      investmentPercentage: value[0].toString(),
      monthlyData: generateMonthlyData({ 
        investmentPercentageOverride: value[0], 
        investmentTrack: client.investmentTrack 
      })
    }));
    await saveClientsToSupabase(updatedClients);
    setClients(updatedClients);
  };

  const handleVisibleSeriesChange = (key: keyof typeof visibleSeries, checked: boolean) => {
    setVisibleSeries(prev => ({ ...prev, [key]: checked }));
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-2 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8">
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
          <Button 
            size="lg"
            className="w-full h-auto bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/add-client')}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs md:text-base font-bold tracking-tight">
                Add New Client
              </span>
              <span className="text-xs md:text-sm font-normal text-white/90">
                Start managing a new portfolio
              </span>
            </div>
          </Button>
          
          <Button 
            size="lg"
            className="w-full h-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/simulator')}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs md:text-base font-bold tracking-tight">
                Investment Simulator
              </span>
              <span className="text-xs md:text-sm font-normal text-white/90">
                See how your money could grow
              </span>
            </div>
          </Button>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-6 md:mb-8">
        <PerformanceChart
          spyReturns={SP500_RETURNS}
          vtiReturns={[]}
          nasdaqReturns={NASDAQ_RETURNS}
        />
      </div>

      <MetricsPanel
        metrics={aggregateMetrics}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
      />

      <ChartControls
        investmentPercentage={investmentPercentage}
        visibleSeries={visibleSeries}
        onInvestmentPercentageChange={handleInvestmentPercentageChange}
        onVisibleSeriesChange={handleVisibleSeriesChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-card text-card-foreground rounded-xl p-3 md:p-6 shadow-sm border border-border col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs md:text-base font-semibold">
              {selectedClient ? `${selectedClient.name}'s Portfolio Performance` : 'Portfolio Performance'}
            </h2>
            {selectedClient && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedClient(null)}
              >
                View All Portfolios
              </Button>
            )}
          </div>
          <div className="h-[400px] md:h-[500px] w-full">
            {clients.length > 0 && (
              <ResponsiveLine
                data={[
                  ...formatChartData(selectedClient ? selectedClient.monthlyData : clients[0]?.monthlyData),
                  ...(comparisonClient ? formatChartData(comparisonClient.monthlyData) : [])
                ]}
                margin={{ top: 30, right: 40, bottom: 70, left: 60 }}
                xScale={{
                  type: 'point'
                }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Timeline',
                  legendOffset: 50,
                  legendPosition: 'middle',
                  format: (value) => value?.toString() || ''
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Amount (ILS)',
                  legendOffset: -45,
                  legendPosition: 'middle',
                  format: (value) => {
                    if (value === null || value === undefined) return '';
                    if (typeof value === 'number') {
                      return new Intl.NumberFormat('he-IL', {
                        style: 'currency',
                        currency: 'ILS',
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(value);
                    }
                    return value.toString();
                  }
                }}
                enableGridX={false}
                enableGridY={true}
                lineWidth={3}
                pointSize={isMobile ? 4 : 6}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                enableSlices="x"
                crosshairType="cross"
                motionConfig="gentle"
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 60,
                    itemsSpacing: 10,
                    itemDirection: 'left-to-right',
                    itemWidth: isMobile ? 80 : 120,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fontSize: isMobile ? 8 : 11,
                        fill: 'hsl(var(--muted-foreground))'
                      }
                    },
                    legend: {
                      text: {
                        fontSize: isMobile ? 9 : 12,
                        fill: 'hsl(var(--muted-foreground))',
                        fontWeight: 500
                      }
                    }
                  },
                  grid: {
                    line: {
                      stroke: 'hsl(var(--border))',
                      strokeWidth: 1,
                      strokeDasharray: '4 4'
                    }
                  },
                  crosshair: {
                    line: {
                      stroke: 'hsl(var(--muted-foreground))',
                      strokeWidth: 1,
                      strokeOpacity: 0.35
                    }
                  },
                  tooltip: {
                    container: {
                      background: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                      fontSize: isMobile ? 10 : 12,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '6px 10px',
                      border: '1px solid hsl(var(--border))'
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-sm md:text-lg font-semibold">Client Overview</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full md:w-[200px] pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowAllClients(!showAllClients)}
              className="w-full md:w-auto"
              variant="outline"
            >
              {showAllClients ? 'Show Less' : 'Show All Clients'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredClientsList
            .slice(0, showAllClients ? undefined : 6)
            .map(client => (
              <ClientCard
                key={client.id}
                client={client}
                metrics={calculateMetrics(client)}
                onSelect={handleClientClick}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;