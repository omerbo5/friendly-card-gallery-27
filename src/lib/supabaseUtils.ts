import { supabase } from "@/integrations/supabase/client";
import { Client, InvestmentTrack } from '@/types/investment';
import { toast } from "@/components/ui/use-toast";

export const saveClientsToSupabase = async (clients: Client[]) => {
  try {
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .neq('id', '0');
    
    if (deleteError) throw deleteError;

    for (const client of clients) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          profession: client.profession,
          custom_profession: client.customProfession,
          monthly_expenses: client.monthlyExpenses,
          investment_percentage: client.investmentPercentage,
          investment_track: client.investmentTrack,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      const monthlyDataInserts = client.monthlyData.map(data => ({
        client_id: clientData.id,
        month: data.month,
        expenses: data.expenses,
        investment: data.investment,
        portfolio_value: data.portfolioValue,
        profit: data.profit
      }));

      const { error: monthlyError } = await supabase
        .from('monthly_data')
        .insert(monthlyDataInserts);

      if (monthlyError) throw monthlyError;
    }

    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving clients:', error);
    toast({
      title: "Error",
      description: "Failed to save client data",
      variant: "destructive"
    });
  }
};

export const getClientsFromSupabase = async (): Promise<Client[]> => {
  try {
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select(`
        id,
        name,
        profession,
        custom_profession,
        monthly_expenses,
        investment_percentage,
        investment_track,
        monthly_data (
          month,
          expenses,
          investment,
          portfolio_value,
          profit
        )
      `);

    if (clientsError) throw clientsError;

    return clientsData.map(client => ({
      id: client.id,
      name: client.name,
      profession: client.profession,
      customProfession: client.custom_profession || undefined,
      monthlyExpenses: client.monthly_expenses,
      investmentPercentage: client.investment_percentage,
      investmentTrack: client.investment_track as InvestmentTrack,
      monthlyData: client.monthly_data.map(data => ({
        month: data.month,
        expenses: data.expenses,
        investment: data.investment,
        portfolioValue: data.portfolio_value,
        profit: data.profit
      }))
    }));
  } catch (error) {
    console.error('Error getting clients:', error);
    toast({
      title: "Error",
      description: "Failed to load client data",
      variant: "destructive"
    });
    return [];
  }
};

export const searchClientsInSupabase = async (searchTerm: string): Promise<Client[]> => {
  try {
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select(`
        id,
        name,
        profession,
        custom_profession,
        monthly_expenses,
        investment_percentage,
        investment_track,
        monthly_data (
          month,
          expenses,
          investment,
          portfolio_value,
          profit
        )
      `)
      .or(`name.ilike.%${searchTerm}%,profession.ilike.%${searchTerm}%`);

    if (clientsError) throw clientsError;

    return clientsData.map(client => ({
      id: client.id,
      name: client.name,
      profession: client.profession,
      customProfession: client.custom_profession || undefined,
      monthlyExpenses: client.monthly_expenses,
      investmentPercentage: client.investment_percentage,
      investmentTrack: client.investment_track as InvestmentTrack,
      monthlyData: client.monthly_data.map(data => ({
        month: data.month,
        expenses: data.expenses,
        investment: data.investment,
        portfolioValue: data.portfolio_value,
        profit: data.profit
      }))
    }));
  } catch (error) {
    console.error('Error searching clients:', error);
    toast({
      title: "Error",
      description: "Failed to search clients",
      variant: "destructive"
    });
    return [];
  }
};