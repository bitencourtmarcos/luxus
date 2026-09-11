import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tskzxxvcrtkaklzayqas.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZNkHVJYV5E8McfvzSGBCvQ_D4nU-mwo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
