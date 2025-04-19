// supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

let supabase;

try {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('❌ URL ou CHAVE do Supabase não configuradas.');
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Conectado ao Supabase com sucesso!');
} catch (error) {
  console.error('🚨 Erro ao conectar ao Supabase:', error.message);
  supabase = null;
}

module.exports = supabase;
