// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://aolstnteevnwqpepqswe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbHN0bnRlZXZud3FwZXBxc3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTEzOTgsImV4cCI6MjA1MzU2NzM5OH0.9q99wjfKMAG9ncsqfR99pBy52v-TDLHxkIbF26IxYwY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);