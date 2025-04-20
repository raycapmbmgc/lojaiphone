require('dotenv').config(); // Se você usa variáveis de ambiente para o Supabase

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'SUA_URL_SUPABASE';
const supabaseKey = process.env.SUPABASE_KEY || 'SUA_CHAVE_SUPABASE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Defina a NOVA senha que você deseja usar AQUI (em texto plano)
const NOVA_SENHA = 'admin12'; // <------------------- ALTERE AQUI

async function atualizarSenhasExistentes() {
  try {
    // Busca todos os administradores
    const { data: admins, error: fetchError } = await supabase
      .from('admins')
      .select('*');

    if (fetchError) {
      console.error("Erro ao buscar administradores:", fetchError);
      return;
    }

    if (!admins || admins.length === 0) {
      console.log("Nenhum administrador encontrado para atualizar.");
      return;
    }

    console.log(`Encontrados ${admins.length} administradores. Iniciando atualização das senhas para "${NOVA_SENHA}"...`);

    for (const admin of admins) {
      const senhaTextoPlano = NOVA_SENHA; // Usando a NOVA_SENHA definida acima
      console.log(`Definindo nova senha para ${admin.usuario}:`, senhaTextoPlano);

      if (typeof senhaTextoPlano !== 'string') {
        console.warn(`A nova senha para ${admin.usuario} (ID: ${admin.id}) não é uma string. Verifique a variável NOVA_SENHA.`);
        continue;
      }

      const saltRounds = 10;
      try {
        const senhaCriptografada = await bcrypt.hash(senhaTextoPlano, saltRounds);

        // Atualiza o registro do administrador com a senha hasheada
        const { error: updateError } = await supabase
          .from('admins')
          .update({ senha: senhaCriptografada })
          .eq('id', admin.id);

        if (updateError) {
          console.error(`Erro ao atualizar a senha do administrador "${admin.usuario}" (ID: ${admin.id}):`, updateError);
        } else {
          console.log(`Senha do administrador "${admin.usuario}" (ID: ${admin.id}) atualizada com sucesso para o hash:`, senhaCriptografada.substring(0, 20) + '...');
        }
      } catch (hashError) {
        console.error(`Erro ao hashear a senha do administrador "${admin.usuario}" (ID: ${admin.id}):`, hashError);
      }
    }

    console.log("Processo de atualização das senhas concluído.");

  } catch (error) {
    console.error("Erro geral no processo de atualização:", error);
  }
}

atualizarSenhasExistentes();
