let produtos = [];

// Carrega os produtos do servidor
fetch('/produtos')
    .then(res => res.json())
    .then(data => {
        console.log('Dados dos produtos:', data); // Verifique os dados retornados
        produtos = data;
        renderizarProdutosCliente(); // Renderiza os produtos logo após o carregamento
    })
    .catch(err => {
        console.error('Erro ao carregar produtos:', err);
    });

// Função para renderizar os produtos no lado do cliente
function renderizarProdutosCliente() {
    console.log('Renderizando produtos...'); // Verificar se a função é chamada
    const lista = document.getElementById('produtos-cliente-lista');
    lista.innerHTML = ''; // Limpa a lista antes de renderizar novamente

    // Verifica se a propriedade 'disponivel' está correta para cada produto
    produtos.forEach(produto => {
        console.log(`Produto ${produto.nome}: Disponível = ${produto.disponivel}`);
    });

    // Filtra apenas os produtos disponíveis
    const produtosDisponiveis = produtos.filter(p => p.disponivel === true);

    console.log('Produtos disponíveis:', produtosDisponiveis); // Verificar os produtos filtrados

    if (produtosDisponiveis.length === 0) {
        lista.innerHTML = '<p style="text-align:center;">Nenhum produto disponível no momento.</p>';
        return;
    }

    // Renderiza os produtos disponíveis
    produtosDisponiveis.forEach(produto => {
        const div = document.createElement('div');
        div.classList.add('card-produto');

        // Seletor de GBs
        let gbsOptions = '';
        if (produto.opcoes?.gbs?.length) {
            gbsOptions = ` 
                <label for="gbs-${produto.id}">Escolha o GB:</label>
                <select id="gbs-${produto.id}">
                    ${produto.opcoes.gbs.map(gb => `<option value="${gb}">${gb} GB</option>`).join('')}
                </select>
            `;
        }

        // Seletor de Cores
        let coresOptions = '';
        if (produto.opcoes?.cores?.length) {
            coresOptions = `
                <label for="cores-${produto.id}">Escolha a cor:</label>
                <select id="cores-${produto.id}">
                    ${produto.opcoes.cores.map(cor => `<option value="${cor}">${cor}</option>`).join('')}
                </select>
            `;
        }

        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao || 'Sem descrição'}</p>
            <p><strong>Preço:</strong> ${produto.preco || 'Não definido'}</p>
            ${gbsOptions}
            ${coresOptions}

            <button onclick="saberMais(${produto.id})">Saber Mais</button>

            <label style="display:block; margin-top:10px;">
                <input type="checkbox" id="entrada-${produto.id}" onchange="toggleFormularioEntrada(${produto.id})">
                Quero dar meu aparelho de entrada
            </label>

            <form id="form-entrada-${produto.id}" class="form-entrada" style="display:none; margin-top:10px;">
                <label>Modelo do aparelho usado:</label>
                <input type="text" name="modelo">

                <label>Porcentagem da bateria:</label>
                <input type="number" name="bateria" min="1" max="100">

                <label>GBs:</label>
                <input type="number" name="gbs">

                <label>Cor:</label>
                <input type="text" name="cor">

                <label>Todo original?</label>
                <select name="original">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>

                <label>Já foi à assistência?</label>
                <select name="assistencia">
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                </select>
            </form>
        `;

        lista.appendChild(div);
    });
}

// Função para alternar a exibição do formulário de aparelho de entrada
function toggleFormularioEntrada(produtoId) {
    const checkbox = document.getElementById(`entrada-${produtoId}`);
    const form = document.getElementById(`form-entrada-${produtoId}`);
    form.style.display = checkbox.checked ? 'block' : 'none';
}

// Função para enviar a mensagem de "Saber Mais" via WhatsApp
function saberMais(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);

    const gbSelecionado = document.getElementById(`gbs-${produtoId}`)?.value || 'Não selecionado';
    const corSelecionada = document.getElementById(`cores-${produtoId}`)?.value || 'Não selecionada';

    const querDarAparelho = document.getElementById(`entrada-${produtoId}`)?.checked;

    let mensagem = `Olá, me interessei pelo produto ${produto.nome}. Gostaria de mais informações sobre ele!

📝 *Detalhes do Produto*:
• Descrição: ${produto.descricao || 'Não definida'}
• Preço: ${produto.preco || 'Não definido'}
• Cor escolhida: ${corSelecionada}
• GB escolhido: ${gbSelecionado}
`;

    if (querDarAparelho) {
        const form = document.getElementById(`form-entrada-${produtoId}`);
        const modelo = form.modelo.value || 'Não informado';
        const bateria = form.bateria.value || 'Não informado';
        const gbs = form.gbs.value || 'Não informado';
        const cor = form.cor.value || 'Não informado';
        const original = form.original.value || 'Não informado';
        const assistencia = form.assistencia.value || 'Não informado';

        mensagem += `

📱 *Aparelho de Entrada*:
• Modelo: ${modelo}
• Bateria: ${bateria}%
• GBs: ${gbs}
• Cor: ${cor}
• Todo original? ${original}
• Já foi à assistência? ${assistencia}`;
    } else {
        mensagem += `

📱 *Aparelho de Entrada*: Sem aparelho de entrada.`;
    }

    const numeroWhatsApp = '5582981636494'; // Substitua pelo número do WhatsApp da loja
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
}

// Função para forçar a atualização manual dos produtos
function atualizarProdutosCliente() {
    fetch('/produtos')
        .then(res => res.json())
        .then(data => {
            produtos = data; // Atualiza os dados dos produtos
            renderizarProdutosCliente(); // Re-renderiza os produtos
        })
        .catch(err => {
            console.error('Erro ao atualizar produtos:', err);
        });
}
