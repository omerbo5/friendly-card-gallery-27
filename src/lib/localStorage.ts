import { Client } from '@/types/investment';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const saveClients = async (clients: Client[]) => {
  try {
    // Delete existing clients
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (deleteError) throw deleteError;

    // Insert new clients
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

      // Insert monthly data for this client
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

    // Notify other tabs about the change
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

export const getClients = async (): Promise<Client[]> => {
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
      investmentTrack: client.investment_track,
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

export const addClient = async (client: Client): Promise<Client[]> => {
  try {
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

    // Insert monthly data
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

    toast({
      title: "Success",
      description: "New client added successfully"
    });

    return getClients();
  } catch (error) {
    console.error('Error adding client:', error);
    toast({
      title: "Error",
      description: "Failed to add new client",
      variant: "destructive"
    });
    return [];
  }
};

export const searchClients = async (searchTerm: string): Promise<Client[]> => {
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
      investmentTrack: client.investment_track,
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