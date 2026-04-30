import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qmuuovbalclrxtblythc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-eQChPPGjegVjLfXQwPGuw_mAHvdsh_';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
