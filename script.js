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
                const categoria = section.dataset.categoria;
                let produtosCategoria;
                const divProdutos = section.querySelector(".div-produtos");
                if (categoria === "Melhor Avaliado") {
                    produtosCategoria = dados.toSorted((a, b) => b.rating - a.rating);
                }
                if (categoria === "Mais Baratos") {
                    produtosCategoria = dados.toSorted((a, b) => (a.promotionalPrice ?? a.price) - (b.promotionalPrice ?? b.price));
                }
                if (categoria === "Em Promoção") {
                    const repetidos = ["Frases motivacionais", "Unhas de anão"];
                    produtosCategoria = dados.filter((dado) => dado.promotionalPrice !== null && !repetidos.includes(dado.name));
                }
                const categorias = {
                    Remédios: "medicine",
                    Estilo: "style",
                    Serviços: "services",
                    Aulas: "classes",
                    Ferramentas: "tools",
                    Conceitos: "concept",
                    Fantásticos: "fantasy"
                }
                if (categorias[categoria]) {
                    produtosCategoria = dados.filter((dado) => dado.categories.includes(categorias[categoria])); 
                    if (categoria === "Conceitos") {
                        produtosCategoria.unshift(dados.filter(dado => dado.name === "Ansiedade")[0]);
                    }
                    if (categoria === "Fantásticos") {
                        const repetidos = ["Unhas de anão", "'Indo Ali' esmagado", "Dado de infinitos lados"]
                        produtosCategoria = produtosCategoria.filter((dado) => !repetidos.includes(dado.name))
                    }
                }
                if (produtosCategoria?.length >= 4) {
                    for (let i = 0; i < 4; i++) {
                        const divProduto = criarProduto(produtosCategoria[i]);
                        divProdutos.append(divProduto);
                    }
                }
            }

        }
        if (document.title === "Conta - Loja Loja") {
            const itensCarrinhos = JSON.parse(localStorage.getItem("carrinho"));
            
            const produtosCompletosNoCarrinho = dados.filter((produto) => itensCarrinhos.includes(produto.id));
            for (let produto of produtosCompletosNoCarrinho) {
                const divProduto = criarProduto(produto);
                sectionsCategorias[1].querySelector(".div-produtos").append(divProduto);
            }
            sectionsCategorias.forEach((section) => {
            })
        }
        botaoToggleCarrinho.addEventListener("click", (e) => {
            atualizarCarrinho(dados);
            sidebarCarrinho.classList.toggle("open");
            backdrop.classList.toggle("open");
        })
    })

