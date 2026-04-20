import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xqjsebuvimcbfmujxwyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanNlYnV2aW1jYmZtdWp4d3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODczNjUsImV4cCI6MjA5MjE2MzM2NX0.2QNZk9_3J-ZZ8cSZ1maLBwiz9OAs3DVgwAtX_QAqEa4',
  { auth: { flowType: 'implicit', detectSessionInUrl: true } }
)