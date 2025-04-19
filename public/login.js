// login.js
async function verificarLogin(event) {
    event.preventDefault();  // Impede o envio do formulário

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const erroMensagem = document.getElementById("erro-mensagem");

    try {
        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        if (resposta.ok) {
            localStorage.setItem('adminLogado', 'true');  // Armazena o status do login
            window.location.href = "admin.html";  // Redireciona para a página do admin
        } else {
            erroMensagem.textContent = "Usuário ou senha inválidos.";
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        erroMensagem.textContent = "Erro ao tentar logar. Tente novamente mais tarde.";
    }
}

document.getElementById("loginForm").addEventListener("submit", verificarLogin);
