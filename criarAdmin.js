// criarAdmin.js
const bcrypt = require('bcrypt');
const supabase = require('./supabase');

async function criarAdmin() {
    const usuario = 'admin';
    const senha = '123456';  // Senha inicial
    const senhaHash = await bcrypt.hash(senha, 10);  // Hash da senha

    const { data, error } = await supabase.from('admins').insert([
        { usuario, senha: senhaHash }
    ]);

    if (error) {
        console.error("Erro ao criar admin:", error);
    } else {
        console.log("✅ Admin criado com sucesso:", data);
    }
}

criarAdmin();
