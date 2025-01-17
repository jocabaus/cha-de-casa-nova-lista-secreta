import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtqgiirslfaadewwwnjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cWdpaXJzbGZhYWRld3d3bmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NzU2NzgsImV4cCI6MjAyNTI1MTY3OH0.vJ-C1ePHRHCxN9V9jEOBmaSMF8AYLIYzQnFhp9L7IbY';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);