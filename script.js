// Importações
import atualizarCarrinho from "./modules/atualizarCarrinho.js";
import criarProduto from "./modules/criarProduto.js";

// Variáveis
const botaoToggleCarrinho = document.querySelector(".nav-carrinho button");
const sidebarCarrinho = document.querySelector(".sidebar-carrinho");
const botaoFecharCarrinho = document.querySelector(".titulo-carrinho button");
const backdrop = document.querySelector(".backdrop");

// Inicialização e Eventos
botaoFecharCarrinho.addEventListener("click", (e) => {
    backdrop.classList.remove("open");
    sidebarCarrinho.classList.remove("open");
})

backdrop.addEventListener("click", (e) => {
    sidebarCarrinho.classList.remove("open");
    backdrop.classList.remove("open");
})

fetch("db.json")
.then(dados => dados.json())
    .then(dados => {
        if (document.title === "Loja Loja") {
            for (let i = 0; i < 4; i++) {
                criarProduto(dados[i])
            }
        }
        botaoToggleCarrinho.addEventListener("click", (e) => {
            atualizarCarrinho(dados);
            sidebarCarrinho.classList.toggle("open");
            backdrop.classList.toggle("open");
        })
    })

