import { createClient } from '@supabase/supabase-js';

const supabaseUrl ='https://nxemjwqoblqftedqbjlk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZW1qd3FvYmxxZnRlZHFiamxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDY5NjUsImV4cCI6MjA1NzE4Mjk2NX0._lssSSwFkn8KR0j32TWuzizGXW0NA-vToSo0f2z_EJQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;