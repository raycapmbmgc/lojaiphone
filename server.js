const express = require('express');
const cors = require('cors');
const path = require('path');
const supabase = require('./supabase');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    console.log("Dados de login recebidos:", req.body); // Já tínhamos isso
    let { usuario, senha } = req.body;
    usuario = usuario.trim().toLowerCase();
    senha = senha.trim();

    console.log("Usuário após trim e lowercase:", usuario);
    console.log("Senha após trim:", senha);

    const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('usuario', usuario)
        .single();

    if (error) {
        console.error("Erro ao buscar admin:", error);
        return res.status(401).json({ erro: 'Erro ao buscar usuário.' });
    }

    if (!admin) {
        return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    console.log("Senha armazenada do banco de dados:", admin.senha); // ADICIONE ESTE LOG

    const senhaCorreta = await bcrypt.compare(senha, admin.senha);

    console.log("Senha correta?", senhaCorreta); // Já tínhamos isso

    if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    res.json({ status: 'logado' });
});
// Painel administrativo
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Rota para obter todos os produtos
app.get('/produtos', async (req, res) => {
    const { data, error } = await supabase
        .from('produtos')
        .select('*');

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        return res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }

    res.json(data);
});

// Rota para adicionar um novo produto
app.post('/produtos', async (req, res) => {
    let produto = req.body;

    if (!produto.nome || !produto.preco || produto.preco === '') {
        return res.status(400).json({ erro: 'Nome e preço são obrigatórios!' });
    }

    if (!produto.preco) {
        produto.preco = 0;
    }

    if (!produto.descricao) {
        produto.descricao = 'Descrição não fornecida';
    }

    console.log("Produto recebido para adicionar:", produto);

    const { data, error } = await supabase.from('produtos').insert([produto]);

    if (error) {
        console.error('Erro ao adicionar produto:', error);
        return res.status(500).json({ erro: 'Erro ao adicionar produto.' });
    }

    console.log('Produto inserido:', data);
    res.json({ status: 'ok', produto: data });
});

// Atualizar produto
app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const produtoAtualizado = req.body;

    delete produtoAtualizado.assistencia; // remover campo inválido

    console.log(`Produto recebido para atualizar (ID: ${id}):`, produtoAtualizado);

    const { data, error } = await supabase
        .from('produtos')
        .update(produtoAtualizado)
        .eq('id', id)
        .select();

    if (error) {
        console.error(`Erro ao atualizar produto com ID ${id}:`, error.message);
        return res.status(500).json({ erro: error.message });
    }

    if (data && data.length > 0) {
        console.log('Produto atualizado no banco de dados:', data[0]);
        res.json(data[0]);
    } else {
        res.status(404).json({ erro: 'Produto não encontrado.' });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
