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

fetch("http://localhost:3000/produtos/listar")
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
        }, 3000);
    });
}

let bancoDeDados;
const openRequest = indexedDB.open("img_db", 1);
openRequest.addEventListener("upgradeneeded", (e) => {
    bancoDeDados = e.target.result;
    console.log(e.target.result)
    const objectStore = bancoDeDados.createObjectStore("img_os", {
        keyPath: "id"
    });
});

if (header) {
    const imagem = header.querySelector("img[alt=Conta]");
    imagem.classList.add("img-conta");
    openRequest.addEventListener("error", () => {
        imagem.src = "assets/icons/account.svg";
        console.error("Banco de dados falhou ao abrir.");
    });
    openRequest.addEventListener("success", () => {
        bancoDeDados = openRequest.result;
        const objectStore = bancoDeDados
            .transaction("img_os")
            .objectStore("img_os");
        const getRequest = objectStore.get(1);
        getRequest.addEventListener("success", (e) => {
            if (!e?.target?.result?.img) {
                imagem.src = "assets/icons/account.svg";
                return;
            }
            const fr = new FileReader();
            fr.onload = () => {
                imagem.src = fr.result;
            };
            fr.readAsDataURL(e.target.result.img);
        });
    });
}