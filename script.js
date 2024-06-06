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
});

backdrop.addEventListener("click", (e) => {
    sidebarCarrinho.classList.remove("open");
    backdrop.classList.remove("open");
});

fetch("db.json")
    .then((dados) => dados.json())
    .then((dados) => {
        if (document.title === "Loja Loja") {
            for (let i = 0; i < sectionsCategorias.length; i++) {
                const section = sectionsCategorias[i];
                const categoria = section.dataset.categoria;
                let produtosCategoria;
                const divProdutos = section.querySelector(".div-produtos");
                if (categoria === "Melhor Avaliado") {
                    produtosCategoria = dados.toSorted(
                        (a, b) => b.rating - a.rating
                    );
                }
                if (categoria === "Mais Baratos") {
                    produtosCategoria = dados.toSorted(
                        (a, b) =>
                            (a.promotionalPrice ?? a.price) -
                            (b.promotionalPrice ?? b.price)
                    );
                }
                if (categoria === "Em Promoção") {
                    const repetidos = ["Frases motivacionais", "Unhas de anão"];
                    produtosCategoria = dados.filter(
                        (dado) =>
                            dado.promotionalPrice !== null &&
                            !repetidos.includes(dado.name)
                    );
                }
                const categorias = {
                    Remédios: "medicine",
                    Estilo: "style",
                    Serviços: "services",
                    Aulas: "classes",
                    Ferramentas: "tools",
                    Conceitos: "concept",
                    Fantásticos: "fantasy",
                };
                if (categorias[categoria]) {
                    produtosCategoria = dados.filter((dado) =>
                        dado.categories.includes(categorias[categoria])
                    );
                    if (categoria === "Conceitos") {
                        produtosCategoria.unshift(
                            dados.filter((dado) => dado.name === "Ansiedade")[0]
                        );
                    }
                    if (categoria === "Fantásticos") {
                        const repetidos = [
                            "Unhas de anão",
                            "'Indo Ali' esmagado",
                            "Dado de infinitos lados",
                        ];
                        produtosCategoria = produtosCategoria.filter(
                            (dado) => !repetidos.includes(dado.name)
                        );
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
            const informacoesConta =
                JSON.parse(localStorage.getItem("informacoesConta")) ?? [];
            const formData = new FormData();
            for (let pos of informacoesConta) {
                formData.append(...pos);
            }

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
                pMensagemVazio.classList.add("pMensagemVazioSection")
                divProdutosCarrinho.append(pMensagemVazio);
            }
        }

        botaoToggleCarrinho.addEventListener("click", (e) => {
            atualizarCarrinho(dados);
            sidebarCarrinho.classList.toggle("open");
            backdrop.classList.toggle("open");
        });
    });
