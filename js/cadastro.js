function cadastroRealizado(event){

    // window.location.href = ;
}

// function setupCadastroForm(){
//     const form = document.querySelector('form');
//     if(form){
//         form.addEventListener('submit', cadastroRealizado);
//     }
// }

// window.addEventListener('DOMContentLoaded', setupCadastroForm);
// window.cadastroRealizado = cadastroRealizado;

document.getElementById("btn-submit").addEventListener("click", function(event) { //TODO: CRIEI UM EVENTO AQUI PARA MANDAR AS COISAS DO FORM
    //AI ADICIONEI UM EVENTO DE CLICK NO BOTAO SUBMIT DO FORMULARIO.
    //ACHO QUE O PROBLEMA ERA QUE O PROPRIO FORM DEVERIA REDIRECIONAR PARA PAGINA DE LOGIN APOS FAZER O CADASTRO


    //TODO: ISSO AQUI TAVA IMPEDINDO DO FORMULARIO REDIRECIONAR PARA PAGINA DE LOGIN
    // if(event){
    //     event.preventDefault();
    // }

    const usuario = document.getElementById("user").value.trim();
    const email = document.getElementById("e_mail").value.trim();
    const senha = document.getElementById("current_password").value.trim();

    if(!usuario || !email || !senha){
        event.preventDefault(); //USEI AQUI PRA NAO REDIRECIONAR CASO DE ERRADO
        alert("Por favor, preencha usuário, e-mail e senha para cadastrar.");
        return;
    }

    localStorage.setItem('cadastroUser', usuario);
    localStorage.setItem('cadastroEmail', email);
    localStorage.setItem('cadastroSenha', senha);

});

document.getElementById("phone").addEventListener("input", function(e) {

    let valor = e.target.value.replace(/\D/g, "");
    console.log(valor);
    if (valor.length <= 10) {
        valor = valor.replace(/(\d{2})(\d{0,5})(\d{0,4})/, "($1) $2-$3");
    } else {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    e.target.value = valor;
});

document.getElementById("e_mail").addEventListener("input", function(e) {
    const valor = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(valor)) {
        e.target.style.borderColor = "green"; // email válido
    } else {
        e.target.style.borderColor = "red"; // email inválido
    }
});