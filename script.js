// Importações
import atualizarCarrinho from "./modules/atualizarCarrinho.js";
import criarProduto from "./modules/criarProduto.js";
import iniciarPaginaPrincipal from "./modules/iniciarPaginaPrincipal.js";

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
            const parametrosURL = new URLSearchParams(location.search);
            if (parametrosURL.get("logout") === "true") {
                localStorage.setItem("estaLogado", "false");
                localStorage.setItem("informacoesConta", JSON.stringify({}));
                let bancoDeDados;
                const openRequest = indexedDB.open("img_db", 1);
                openRequest.addEventListener("error", () => {
                    console.error("Banco de dados falhou ao abrir.");
                });
                openRequest.addEventListener("success", () => {
                    bancoDeDados = openRequest.result;
                    const objectStore = bancoDeDados
                        .transaction("img_os", "readwrite")
                        .objectStore("img_os");
                    const deleteRequest = objectStore.delete(1);
                });
            }

            const estaLogado = localStorage.getItem("estaLogado") === "true";
            if (estaLogado && location.hostname === "bruno08nunes.github.io") {
                location.pathname = "loja-loja/pages/account.html";
            }
            if (estaLogado) {
                location.pathname = "pages/account.html";
            }

            const form = document.querySelector("form");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                localStorage.setItem("estaLogado", "true");
                localStorage.setItem(
                    "informacoesConta",
                    JSON.stringify([...formData])
                );
                if (location.hostname === "bruno08nunes.github.io") {
                    location.pathname = "loja-loja/pages/account.html";
                }
                location.pathname = "pages/account.html";
            });
        }
        if (document.title === "Conta - Loja Loja") {
            if (location.search !== "") {
                location.search = "";
            }
            const informacoesConta =
                JSON.parse(localStorage.getItem("informacoesConta")) ?? [];
            const formData = new FormData();
            for (let pos of informacoesConta) {
                formData.append(...pos);
            }

            document.title =
                formData.get("nome") +
                " " +
                formData.get("sobrenome") +
                " - Loja Loja";

            const nomeConta = document.querySelector(".name-account");
            let textoNomeConta = "Desconhecido";
            let email = "";
            if (
                formData.get("nome") !== null ||
                formData.get("sobrenome") !== null
            ) {
                textoNomeConta =
                    formData.get("nome") + " " + formData.get("sobrenome");
            }
            if (formData.get("email") !== null) {
                email = formData.get("email");
            }
            nomeConta.textContent = textoNomeConta;

            const elementoEmail = document.querySelector(".email-account");
            elementoEmail.textContent = email;

            const botaoEnviarFoto = document.querySelector("#inp-foto-conta");
            const imagem = document.querySelector(".img-account");
            let src = "assets/icons/account.svg";

            let bancoDeDados;
            const openRequest = indexedDB.open("img_db", 1);
            openRequest.addEventListener("error", () => {
                imagem.src = src;
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
                        imagem.src = src;
                        return;
                    }
                    const fr = new FileReader();
                    fr.onload = () => {
                        imagem.src = fr.result;
                    };
                    fr.readAsDataURL(e.target.result.img);
                });
            });
            openRequest.addEventListener("upgradeneeded", (e) => {
                bancoDeDados = e.target.result;
                const objectStore = bancoDeDados.createObjectStore("img_os", {
                    keyPath: "id",
                });
            });

            botaoEnviarFoto.addEventListener("change", (e) => {
                const transaction = bancoDeDados.transaction(
                    ["img_os"],
                    "readwrite"
                );
                const objectStore = transaction.objectStore("img_os");
                objectStore.put({ img: e.target.files[0], id: 1 });
                transaction.addEventListener("complete", () => {
                    const transaction = bancoDeDados.transaction(
                        ["img_os"],
                        "readwrite"
                    );
                    const objectStore = transaction.objectStore("img_os");
                    const getRequest = objectStore.get(1);
                    getRequest.addEventListener("success", (e) => {
                        const fr = new FileReader();
                        fr.onload = () => {
                            imagem.src = fr.result;
                        };
                        fr.readAsDataURL(e.target.result.img);
                    });
                });
                transaction.addEventListener("error", () => {
                    console.error("Transação não executada com sucesso");
                });
            });

            const itensFavoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
            const produtosFavoritosCompletos = dados.filter((produto) =>
                itensFavoritos.includes(produto.id)
            );
            const divProdutosFavoritos = sectionsCategorias[0].querySelector(".div-produtos");
            for (let produto of produtosFavoritosCompletos) {
                const divProduto = criarProduto(produto);
                divProdutosFavoritos.append(divProduto);
            }
            if (produtosFavoritosCompletos.length === 0) {
                const pMensagemVazio = document.createElement("p");
                pMensagemVazio.textContent = "Você não tem itens favoritos";
                pMensagemVazio.classList.add("pMensagemVazioSection");
                divProdutosFavoritos.append(pMensagemVazio);
            }

            const itensCarrinhos =
                JSON.parse(localStorage.getItem("carrinho")) ?? [];

            const produtosCompletosNoCarrinho = dados.filter((produto) =>
                itensCarrinhos.includes(produto.id)
            );
            const divProdutosCarrinho =
                sectionsCategorias[1].querySelector(".div-produtos");
            for (let produto of produtosCompletosNoCarrinho) {
                const divProduto = criarProduto(produto);
                divProdutosCarrinho.append(divProduto);
            }
            if (produtosCompletosNoCarrinho.length === 0) {
                const pMensagemVazio = document.createElement("p");
                pMensagemVazio.textContent = "Seu carrinho está vazio.";
                pMensagemVazio.classList.add("pMensagemVazioSection");
                divProdutosCarrinho.append(pMensagemVazio);
            }

            const itensHistorico =
                JSON.parse(localStorage.getItem("itensComprados")) ?? [];
            const itensCompletosHistorico = dados.filter((produto) =>
                itensHistorico.includes(produto.id)
            );
            const divProdutosHistorico =
                sectionsCategorias[2].querySelector(".div-produtos");
            for (let produto of itensCompletosHistorico) {
                const divProduto = criarProduto(produto);
                divProdutosHistorico.append(divProduto);
            }
            if (itensCompletosHistorico.length === 0) {
                const pMensagemVazio = document.createElement("p");
                pMensagemVazio.textContent = "Você não tem itens no histórico";
                pMensagemVazio.classList.add("pMensagemVazioSection");
                divProdutosHistorico.append(pMensagemVazio);
            }
        }
        if (document.title.startsWith("Produto")) {
            const parametrosURL = new URLSearchParams(location.search);
            const id = Number(parametrosURL.get("produto"));
            const produto = dados.filter((dado) => dado.id === id)[0];

            document.title = produto.name + " - Loja Loja";

            const imagem = document.querySelector(".imagem-pagina-produto");
            imagem.src = "assets/products/" + produto?.image;
            imagem.alt =
                "Imagem de " + (produto?.name ?? "Produto Desconhecido");

            const nomeProduto = document.querySelector(".nome-pagina-produto");
            nomeProduto.textContent = produto?.name ?? "Produto desconhecido";

            const descricaoProduto = document.querySelector(
                ".descricao-pagina-produto"
            );
            descricaoProduto.textContent = produto?.description ?? "";

            const elementoPrecoPrePromocao = document.querySelector(
                ".preco-antes-promocao"
            );
            const elementoPreco = document.querySelector(
                ".preco-pagina-produto"
            );
            let precoAtual = produto?.price ?? "";

            if (
                produto?.promotionalPrice !== null &&
                produto?.promotionalPrice !== undefined
            ) {
                elementoPrecoPrePromocao.textContent = "R$ " + produto?.price;
                precoAtual = produto?.promotionalPrice ?? "";
            }
            elementoPreco.textContent = "R$ " + precoAtual;

            const avaliacaoNumero = document.querySelector(
                ".nota-produto-numero"
            );
            avaliacaoNumero.textContent = produto?.rating ?? "";

            const avaliacaoEstrela = document.querySelector(".nota-produto");

            const notaEmPorcentagem = produto?.rating * 20;
            const restoPorcentagem = 100 - notaEmPorcentagem;

            avaliacaoEstrela.style.setProperty(
                "--porcentagem-nota",
                `${notaEmPorcentagem}%`
            );
            avaliacaoEstrela.style.setProperty(
                "--porcentagem-branco",
                `${restoPorcentagem}%`
            );

            const botaoCarrinho = document.querySelector(
                "#botao-carrinho-produto"
            );
            botaoCarrinho.dataset.id = produto?.id;
            const idItensNoCarrinho =
                JSON.parse(localStorage.getItem("carrinho")) ?? [];
            if (idItensNoCarrinho.includes(produto?.id)) {
                botaoCarrinho.classList.add("adicionado-ao-carrinho");
            }

            botaoCarrinho.addEventListener("click", (e) => {
                const idItensNoCarrinho =
                    JSON.parse(localStorage.getItem("carrinho")) ?? [];
                botaoCarrinho.classList.toggle("adicionado-ao-carrinho");
                if (idItensNoCarrinho.includes(produto?.id)) {
                    const novoCarrinho = idItensNoCarrinho.filter(
                        (id) => id !== produto?.id
                    );
                    localStorage.setItem(
                        "carrinho",
                        JSON.stringify(novoCarrinho)
                    );
                    return;
                }
                idItensNoCarrinho.push(produto?.id);
                localStorage.setItem(
                    "carrinho",
                    JSON.stringify(idItensNoCarrinho)
                );
            });

            const comentarios = document.querySelector(".section-comentarios");
            if (produto?.reviews.length === 0 || produto === undefined) {
                const mensagem = document.createElement("p");
                mensagem.textContent =
                    "Nenhum comentário disponível no momento.";
                mensagem.classList.add("comentarios-vazio");

                comentarios.append(mensagem);
            }
            for (let review of produto?.reviews ?? []) {
                const comentario = document.createElement("article");
                comentario.classList.add("comentario");

                const dadosComentario = document.createElement("div");
                dadosComentario.classList.add("dados-comentario");

                const comentarista = document.createElement("p");
                comentarista.classList.add("comentarista");
                comentarista.textContent = review.reviewerName;

                const data = document.createElement("time");
                data.classList.add("data-comentario");
                data.textContent = review.date;

                dadosComentario.append(comentarista, data);

                const avaliacaoComentario = document.createElement("p");
                avaliacaoComentario.classList.add(
                    "avaliacao-pagina-produto",
                    "avaliacao-comentario"
                );

                const notaNumero = document.createElement("span");
                notaNumero.classList.add("nota-produto-numero");
                notaNumero.textContent = review.rating;

                const notaEstrela = document.createElement("span");
                notaEstrela.classList.add("nota-produto");
                notaEstrela.textContent = "★".repeat(5);
                const notaEmPorcentagem = review.rating * 20;
                const restoPorcentagem = 100 - notaEmPorcentagem;
                notaEstrela.style.setProperty(
                    "--porcentagem-nota",
                    `${notaEmPorcentagem}%`
                );
                notaEstrela.style.setProperty(
                    "--porcentagem-branco",
                    `${restoPorcentagem < 50 ? restoPorcentagem : 0}%`
                );

                avaliacaoComentario.append(notaNumero, " ", notaEstrela);

                const pMensagem = document.createElement("p");
                pMensagem.classList.add("mensagem-comentario");
                pMensagem.textContent = review.comment;

                comentario.append(
                    dadosComentario,
                    avaliacaoComentario,
                    pMensagem
                );
                comentarios.append(comentario);
            }
        }

        if (document.title === "Finalizar Compra - Loja Loja") {
            
            const informacoesConta = new FormData();
            const informacoesContaLocalStorage =
            JSON.parse(localStorage.getItem("informacoesConta")) ?? [];
            const estaLogado = localStorage.getItem("estaLogado");
            if (estaLogado === "false") {
                location.pathname = "pages/form-account.html";
            }
            informacoesContaLocalStorage.forEach((informacao) => {
                informacoesConta.append(informacao[0], informacao[1]);
            });

            const nome = document.querySelector("#nome");
            nome.value = informacoesConta.get("nome");

            const sobrenome = document.querySelector("#sobrenome");
            sobrenome.value = informacoesConta.get("sobrenome");

            const form = document.querySelector("form");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const itensCarrinhos = JSON.parse(
                    localStorage.getItem("carrinho")
                );
                const itensComprados =
                    JSON.parse(localStorage.getItem("itensComprados")) ?? [];
                itensCarrinhos.forEach((item) => {
                    if (!itensComprados.includes(item)) {
                        itensComprados.push(item);
                    }
                });
                localStorage.setItem(
                    "itensComprados",
                    JSON.stringify(itensComprados)
                );
                localStorage.setItem("carrinho", JSON.stringify([]));

                const mensagemCompraFinalizada = document.createElement("p");
                mensagemCompraFinalizada.textContent =
                    "Compra Concluída com Sucesso";
                mensagemCompraFinalizada.classList.add(
                    "mensagem-compra-finalizada"
                );
                document.body.append(mensagemCompraFinalizada);

                setTimeout(() => {
                    location.pathname = "";
                }, 2000);
            });
        }

        botaoToggleCarrinho.addEventListener("click", (e) => {
            atualizarCarrinho(dados);
            sidebarCarrinho.classList.toggle("open");
            backdrop.classList.toggle("open");
        });
    });
