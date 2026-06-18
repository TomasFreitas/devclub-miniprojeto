function login(event){
    if(event){
        event.preventDefault();
    }

    const loginValue = document.getElementById("firstinput").value.trim();
    const senha = document.getElementById("secondinput").value.trim();

    const usuarioCadastrado = localStorage.getItem('cadastroUser');
    const emailCadastrado = localStorage.getItem('cadastroEmail');
    const senhaCadastrada = localStorage.getItem('cadastroSenha');


    console.log(usuarioCadastrado);
    const isAdmin = loginValue === "admin" && senha === "admin";
    const isLoginByEmail = loginValue === emailCadastrado && senha === senhaCadastrada;
    const isLoginByUser = loginValue === usuarioCadastrado && senha === senhaCadastrada;

    if(isAdmin || isLoginByEmail || isLoginByUser){
        window.location.href = "../html/devclub.html";
        alert("Login realizado com sucesso! Bem-vindo ao DevClub!");
        return;
    }

    document.getElementById("firstinput").value = "";
    document.getElementById("secondinput").value = "";
    alert("Usuário ou senha incorretos. Tente novamente.");
}

function setupLoginForm(){
    const form = document.querySelector('form');
    if(form){
        form.addEventListener('submit', login);
    }
}

window.addEventListener('DOMContentLoaded', setupLoginForm);
window.login = login;