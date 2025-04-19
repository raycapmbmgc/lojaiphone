let produtos = [];

// Verifica se há produtos no localStorage ou se deve buscar do servidor
if (localStorage.getItem('produtos')) {
    produtos = JSON.parse(localStorage.getItem('produtos'));
    inicializarAdmin();
} else {
    fetch('/produtos') // Modificado para pegar produtos do backend
    .then(res => res.json())
    .then(data => {
        console.log("Produtos carregados do servidor:", data);
        produtos = data;
        localStorage.setItem('produtos', JSON.stringify(produtos));
        inicializarAdmin();
    })
    .catch(error => {
        console.error("Erro ao carregar os produtos:", error);
    });
}

// Função para salvar produtos no localStorage (mantida para otimizar a experiência do admin)
function salvarProdutosNoStorage() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para verificar o acesso do admin (mantida)
function verificarAcessoAdmin() {
    if (!localStorage.getItem('adminLogado')) {
        window.location.href = 'login.html';
    }
}

// Função para renderizar a lista de produtos no painel do admin (mantida)
function renderizarProdutosAdmin() {
    const lista = document.getElementById('produtos-admin-lista');
    lista.innerHTML = '';

    if (produtos.length === 0) {
        const aviso = document.createElement('div');
        aviso.textContent = 'Nenhum produto disponível para exibição.';
        lista.appendChild(aviso);
    }

    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.classList.add('produto-admin');

        const coresDisplay = produto.opcoes?.cores?.length ? produto.opcoes.cores.join(', ') : 'Não disponível';
        const gbsDisplay = produto.opcoes?.gbs?.length ? produto.opcoes.gbs.join(', ') : 'Não disponível';

        div.innerHTML = `
            <div>
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
                <h3>${produto.nome}</h3>
                <p><strong>ID:</strong> ${produto.id}</p>
                <p><strong>Status:</strong> ${produto.disponivel ? 'Disponível' : 'Indisponível'}</p>
                <p><strong>Descrição:</strong> ${produto.descricao || 'Não definida'}</p>
                <p><strong>Preço:</strong> ${produto.preco || 'Não definido'}</p>
                <p><strong>Cores:</strong> ${coresDisplay}</p>
                <p><strong>GBs:</strong> ${gbsDisplay}</p>
            </div>

            <button onclick="toggleFormulario(${produto.id})">Atualizar</button>

            <form id="form-${produto.id}" class="form-produto" style="display: none;" onsubmit="atualizarProduto(event, ${produto.id})">
                <label>Descrição:</label>
                <input type="text" name="descricao" value="${produto.descricao || ''}" required>

                <label>Preço:</label>
                <input type="text" name="preco" value="${produto.preco || ''}" required>

                <label>Cores (separadas por vírgula):</label>
                <input type="text" name="cores" value="${produto.opcoes?.cores?.join(', ') || ''}">

                <label>GBs (separados por vírgula):</label>
                <input type="text" name="gbs" value="${produto.opcoes?.gbs?.join(', ') || ''}">

                <button type="submit">Salvar Alterações</button>
            </form>

            <button onclick="toggleDisponibilidade(${produto.id})">
                ${produto.disponivel ? 'Ocultar Produto (Cliente)' : 'Mostrar Produto (Cliente)'}
            </button>
        `;

        lista.appendChild(div);
    });
}

// Função para alternar o formulário de edição (mantida)
function toggleFormulario(produtoId) {
    const form = document.getElementById(`form-${produtoId}`);
    const botao = form.previousElementSibling;

    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    botao.textContent = form.style.display === 'block' ? 'Fechar' : 'Atualizar';
}

// Função para atualizar o produto (modificada para enviar para o servidor)
function atualizarProduto(event, produtoId) {
    event.preventDefault();

    const form = event.target;
    const produtoAtualizado = produtos.find(p => p.id === produtoId);

    produtoAtualizado.descricao = form.descricao.value;
    produtoAtualizado.preco = form.preco.value;

    if (isNaN(produtoAtualizado.preco) || produtoAtualizado.preco <= 0) {
        alert("Preço inválido. Por favor insira um número positivo.");
        return;
    }

    produtoAtualizado.opcoes.cores = form.cores.value.split(',').map(c => c.trim());
    produtoAtualizado.opcoes.gbs = form.gbs.value.split(',').map(g => parseInt(g.trim())).filter(g => !isNaN(g) && g > 0);

    // Envia a atualização para o servidor
    fetch(`/produtos/${produtoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoAtualizado),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Produto atualizado no servidor:', data);
        // Atualiza o localStorage e renderiza novamente a lista
        salvarProdutosNoStorage();
        renderizarProdutosAdmin();
    })
    .catch(error => {
        console.error('Erro ao atualizar produto no servidor:', error);
        alert('Erro ao atualizar o produto. Tente novamente.');
    });
}

// Função para alternar a disponibilidade de um produto (modificada para enviar para o servidor)
function toggleDisponibilidade(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    produto.disponivel = !produto.disponivel;

    // Envia a atualização de disponibilidade para o servidor
    fetch(`/produtos/${produtoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disponivel: produto.disponivel }),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Disponibilidade atualizada no servidor:', data);
        // Atualiza o localStorage e renderiza novamente a lista
        salvarProdutosNoStorage();
        renderizarProdutosAdmin();
    })
    .catch(error => {
        console.error('Erro ao atualizar disponibilidade no servidor:', error);
        alert('Erro ao atualizar a disponibilidade do produto. Tente novamente.');
    });
}

// Função para fazer logout (mantida)
function logout() {
    localStorage.removeItem('adminLogado');
    window.location.href = 'index.html';
}

// Função para inicializar o painel admin (mantida)
function inicializarAdmin() {
    verificarAcessoAdmin();
    renderizarProdutosAdmin();
}