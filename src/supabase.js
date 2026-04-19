import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xqjsebuvimcbfmujxwyq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanNlYnV2aW1jYmZtdWp4d3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODczNjUsImV4cCI6MjA5MjE2MzM2NX0.2QNZk9_3J-ZZ8cSZ1maLBwiz9OAs3DVgwAtX_QAqEa4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);