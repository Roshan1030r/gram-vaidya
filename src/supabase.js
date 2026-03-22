import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qlhebebuzoazczqmqiem.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGViZWJ1em9hemN6cW1xaWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzkyNTUsImV4cCI6MjA4OTc1NTI1NX0.4H3ohQ4GGYEoOH0jyVTA9_UhHbYqW9z17brXkKBb6XA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)