// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xqfdoryrsqgvecrjztkp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZmRvcnlyc3FndmVjcmp6dGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMDExOTcsImV4cCI6MjA1MzU3NzE5N30.DtI-CB8Az0FjRtQg_c2oyio2A0R9ZcVumbyt09vXA7k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);