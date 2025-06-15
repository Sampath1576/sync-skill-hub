
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://huhbctjiuqvbqixmllyg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1aGJjdGppdXF2YnFpeG1sbHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTIzMTIsImV4cCI6MjA2NTM4ODMxMn0.1FWw4ARsJEZGR-X16mjYSpPzHJSYD_VFhIKEaxheO4Y'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
