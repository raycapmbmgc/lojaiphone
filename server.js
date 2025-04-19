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

// Verificar login
app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('usuario', usuario)
        .single();

    if (error || !admin) {
        return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, admin.senha);

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

// Rota para atualizar um produto existente
app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const produtoAtualizado = req.body;

    console.log(`Produto recebido para atualizar (ID: ${id}):`, produtoAtualizado);

    const { data, error } = await supabase
        .from('produtos')
        .update(produtoAtualizado)
        .eq('id', id)
        .select(); // Para retornar os dados atualizados

    if (error) {
        console.error(`Erro ao atualizar produto com ID ${id}:`, error);
        return res.status(500).json({ erro: 'Erro ao atualizar o produto.' });
    }

    if (data && data.length > 0) {
        console.log('Produto atualizado no banco de dados:', data[0]);
        res.json(data[0]);
    } else {
        res.status(404).json({ erro: 'Produto não encontrado.' });
    }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));