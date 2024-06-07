// Importações
import atualizarCarrinho from "./modules/atualizarCarrinho.js";
import iniciarPaginaPrincipal from "./modules/iniciarPaginaPrincipal.js";
import iniciarPaginaLogin from "./modules/iniciarPaginaLogin.js";
import iniciarPaginaConta from "./modules/iniciarPaginaConta.js";
import iniciarPaginaProduto from "./modules/iniciarPaginaProduto.js";
import iniciarPaginaFinalizarCompra from "./modules/inicializarPaginaFinalizarCompra.js";

// Variáveis
const botaoToggleCarrinho = document.querySelector(".nav-carrinho button");
const sidebarCarrinho = document.querySelector(".sidebar-carrinho");
const botaoFecharCarrinho = document.querySelector(".titulo-carrinho button");
const backdrop = document.querySelector(".backdrop");
const footer = document.querySelector(".footer");

// Inicialização e Eventos
botaoFecharCarrinho.addEventListener("click", (e) => {
    backdrop.classList.remove("open");
    sidebarCarrinho.classList.remove("open");
});

backdrop.addEventListener("click", (e) => {
    sidebarCarrinho.classList.remove("open");
    backdrop.classList.remove("open");
});

fetch("db.json")
    .then((dados) => dados.json())
    .then((dados) => {
        if (document.title === "Loja Loja") {
            iniciarPaginaPrincipal(dados);
        }
        if (document.title === "Logar - Loja Loja") {
            iniciarPaginaLogin();
        }
        if (document.title === "Conta - Loja Loja") {
            iniciarPaginaConta(dados);
        }
        if (document.title.startsWith("Produto")) {
            iniciarPaginaProduto(dados);
        }
        if (document.title === "Finalizar Compra - Loja Loja") {
            iniciarPaginaFinalizarCompra();
        }

        botaoToggleCarrinho.addEventListener("click", (e) => {
            atualizarCarrinho(dados);
            sidebarCarrinho.classList.toggle("open");
            backdrop.classList.toggle("open");
        });
    });

if (footer) {
    const form = footer.querySelector(".form-footer");
    const mensagem = document.createElement("p");
    mensagem.textContent = "Email cadastrado com sucesso";
    mensagem.classList.add("mensagem-compra-finalizada");
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        document.body.append(mensagem);
        setTimeout(() => {
            mensagem.remove();
        }, 3000)
    });

}
