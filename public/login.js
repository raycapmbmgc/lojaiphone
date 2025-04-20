// login.js
async function verificarLogin(event) {
    event.preventDefault();  // Impede o envio do formulário

    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();    
    const erroMensagem = document.getElementById("erro-mensagem");

    try {
        // Altere a URL para o link do seu projeto no Glitch
        const resposta = await fetch('https://jumbled-ivory-spoonbill.glitch.me/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        if (resposta.ok) {
            localStorage.setItem('adminLogado', 'true');  // Armazena o status do login
            window.location.href = "admin.html";  // Redireciona para a página do admin
        } else {
            const erroData = await resposta.json();
            erroMensagem.textContent = erroData.erro || "Usuário ou senha inválidos.";
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        erroMensagem.textContent = "Erro ao tentar logar. Tente novamente mais tarde.";
    }
}

document.getElementById("toggleSenha").addEventListener("click", function() {
    const senhaInput = document.getElementById("senha");
    const toggleSenha = document.getElementById("toggleSenha");

    // Verifica se a senha está oculta (tipo "password")
    if (senhaInput.type === "password") {
        senhaInput.type = "text"; // Torna a senha visível
        toggleSenha.textContent = "👐"; // Muda para o ícone do macaquinho abrindo a mão
    } else {
        senhaInput.type = "password"; // Torna a senha oculta novamente
        toggleSenha.textContent = "🙈"; // Muda para o ícone do macaquinho escondendo os olhos
    }
});

document.getElementById("loginForm").addEventListener("submit", verificarLogin);
