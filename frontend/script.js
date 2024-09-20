// Importações
import atualizarCarrinho from "./modules/atualizarCarrinho.js";
import iniciarPaginaPrincipal from "./modules/iniciarPaginaPrincipal.js";
import iniciarPaginaCadastro from "./modules/iniciarPaginaCadastro.js";
import iniciarPaginaLogin from "./modules/iniciarPaginaLogin.js";
import iniciarPaginaAtualizarConta from "./modules/iniciarPaginaAtualizarConta.js";
import iniciarPaginaConta from "./modules/iniciarPaginaConta.js";
import iniciarPaginaProduto from "./modules/iniciarPaginaProduto.js";
import iniciarPaginaFinalizarCompra from "./modules/inicializarPaginaFinalizarCompra.js";
import iniciarPaginaCriarCategoria from "./modules/iniciarPaginaCriarCategoria.js";
import iniciarPaginaCriarProduto from "./modules/iniciarPaginaCriarProduto.js";
import iniciarPaginaGerenciarProdutos from "./modules/iniciarPaginaGerenciarProdutos.js";
import iniciarPaginaPesquisa from "./modules/iniciarPaginaPesquisa.js";

// Variáveis
const botaoToggleCarrinho = document.querySelector(".nav-carrinho button");
const sidebarCarrinho = document.querySelector(".sidebar-carrinho");
const botaoFecharCarrinho = document.querySelector(".titulo-carrinho button");
const backdrop = document.querySelector(".backdrop");
const footer = document.querySelector(".footer");
const header = document.querySelector(".cabecalho-principal");

// Inicialização e Eventos
botaoFecharCarrinho.addEventListener("click", (e) => {
    backdrop.classList.remove("open");
    sidebarCarrinho.classList.remove("open");
});

backdrop.addEventListener("click", (e) => {
    sidebarCarrinho.classList.remove("open");
    backdrop.classList.remove("open");
});

const usuarioId = localStorage.getItem("usuarioLogado");

const rota = usuarioId ? "http://localhost:3000/produtos/listar?usuario=" + usuarioId : "http://localhost:3000/produtos/listar"

fetch(rota)
    .then((dados) => dados.json())
    .then((dados) => {
        if (document.title === "Loja Loja") {
            iniciarPaginaPrincipal(dados.data);
        }
        if (document.title === "Cadastrar - Loja Loja") {
            iniciarPaginaCadastro();
        }
        if (document.title === "Conta - Loja Loja") {
            iniciarPaginaConta(dados.data);
        }
        if (document.title.startsWith("Produto")) {
            iniciarPaginaProduto(dados.data);
        }
        if (document.title === "Finalizar Compra - Loja Loja") {
            iniciarPaginaFinalizarCompra(dados.data);
        }
        if (document.title === "Login - Loja Loja") {
            iniciarPaginaLogin();
        }
        if (document.title === "Atualizar Conta - Loja Loja") {
            iniciarPaginaAtualizarConta();
        }
        if (document.title === "Criar Categoria - Loja Loja") {
            iniciarPaginaCriarCategoria();
        }
        if (document.title === "Criar Produto - Loja Loja") {
            iniciarPaginaCriarProduto();
        }
        if (document.title === "Gerenciar Produto - Loja Loja") {
            iniciarPaginaGerenciarProdutos(dados.data);
        }
        if (document.title === "Pesquisar Produtos - Loja Loja") {
            iniciarPaginaPesquisa(dados.data);
        }

        botaoToggleCarrinho.addEventListener("click", (e) => {
            atualizarCarrinho(dados.data);
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
        }, 3000);
    });
}

if (usuarioId && usuarioId !== null) {
    fetch(`http://localhost:3000/usuario/informacoes/${usuarioId}`)
        .then((res) => res.json())
        .then((resultados) => {
            const nav = document.querySelector(".nav-header");
            if (!resultados.success || resultados.data.length === 0) {
                return;
            }

            const { role, image } = resultados.data[0];
            if (role === "A") {
                const link = document.createElement("a");
                link.href = "pages/gerenciar.html";

                const img = document.createElement("img");
                img.src = "assets/icons/settings.svg";

                link.append(img);

                nav.append(link);
            }

            if (header) {
                const imagem = header.querySelector("img[alt=Conta]");
                imagem.classList.add("img-conta");
                imagem.src = image ? `assets/users/${image}` : "assets/icons/account.svg";
            }
        });
}
