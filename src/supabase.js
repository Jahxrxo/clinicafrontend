import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gsxlhfvctuqeorolzglw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeGxoZnZjdHVxZW9yb2x6Z2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTI1MjgsImV4cCI6MjA3NDgyODUyOH0.OWTp4Mn1RDpjWFBbJgMNf6MoQMVlVK65qRl2HCXCzIQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
