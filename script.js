// Importações
import atualizarCarrinho from "./modules/atualizarCarrinho.js";
import criarProduto from "./modules/criarProduto.js";

// Variáveis
const botaoToggleCarrinho = document.querySelector(".nav-carrinho button");
const sidebarCarrinho = document.querySelector(".sidebar-carrinho");
const botaoFecharCarrinho = document.querySelector(".titulo-carrinho button");
const backdrop = document.querySelector(".backdrop");

const sectionsCategorias = document.querySelectorAll(".section-categoria");

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
            for (let i = 0; i < sectionsCategorias.length; i++) {
                const section = sectionsCategorias[i];
                const categoria = section.dataset.categoria
                if (categoria === "Melhor Avaliado") {
                    const melhoresAvaliados = dados.toSorted((a, b) => b.rating - a.rating);
                    
                    const divProdutos = section.querySelector(".div-produtos");
                    for (let i = 0; i < 4; i++) {
                        const divProduto = criarProduto(melhoresAvaliados[i]);
                        divProdutos.append(divProduto);
                    }
                }
                if (categoria === "Mais Baratos") {
                    const menoresPrecos = dados.toSorted((a, b) => (a.promotionalPrice ?? a.price) - (b.promotionalPrice ?? b.price));
                    
                    const divProdutos = section.querySelector(".div-produtos");
                    for (let i = 0; i < 4; i++) {
                        const divProduto = criarProduto(menoresPrecos[i]);
                        divProdutos.append(divProduto);
                    }
                }
                if (categoria === "Em Promoção") {
                    const repetidos = ["Frases motivacionais", "Unhas de anão"]
                    const emPromocao = dados.filter((dado) => dado.promotionalPrice !== null && !repetidos.includes(dado.name));
                    
                    const divProdutos = section.querySelector(".div-produtos");
                    for (let i = 0; i < 4; i++) {
                        const divProduto = criarProduto(emPromocao[i]);
                        divProdutos.append(divProduto);
                    }
                }
            }

        }
        botaoToggleCarrinho.addEventListener("click", (e) => {
            atualizarCarrinho(dados);
            sidebarCarrinho.classList.toggle("open");
            backdrop.classList.toggle("open");
        })
    })

