function cadastroRealizado(event){
    if(event){
        event.preventDefault();
    }

    const usuario = document.getElementById("user").value.trim();
    const email = document.getElementById("e_mail").value.trim();
    const senha = document.getElementById("current_password").value.trim();

    if(!usuario || !email || !senha){
        alert("Por favor, preencha usuário, e-mail e senha para cadastrar.");
        return;
    }

    localStorage.setItem('cadastroUser', usuario);
    localStorage.setItem('cadastroEmail', email);
    localStorage.setItem('cadastroSenha', senha);

    alert("Cadastro realizado com sucesso! Faça login no DevClub!");
    window.location.href = "../html/login_page.html";
}

function setupCadastroForm(){
    const form = document.querySelector('form');
    if(form){
        form.addEventListener('submit', cadastroRealizado);
    }
}

window.addEventListener('DOMContentLoaded', setupCadastroForm);
window.cadastroRealizado = cadastroRealizado;