// supabase.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jcjrjoaopubhzvlokfeq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjanJqb2FvcHViaHp2bG9rZmVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTAxMzEwMSwiZXhwIjoyMDYwNTg5MTAxfQ.B8W4BgSk0uhNjZ2AhuaRZhzsUp1WImnsUEntK7_ikEE';

let supabase;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('❌ URL ou CHAVE do Supabase não configuradas.');
  }

  console.log('✅ Conectado ao Supabase com sucesso!');
} catch (error) {
  console.error('🚨 Erro ao conectar ao Supabase:', error.message);
  supabase = null;
}

module.exports = supabase;
