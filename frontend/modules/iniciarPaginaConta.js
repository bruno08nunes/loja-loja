import criarProduto from "./criarProduto.js";

const sectionsCategorias = document.querySelectorAll(".section-categoria");

const exibirDadosConta = () => {
    const informacoesConta =
        JSON.parse(localStorage.getItem("informacoesConta")) ?? [];
    const formData = new FormData();
    for (let pos in informacoesConta) {
        formData.append(...informacoesConta[pos]);
    }

    document.title =
        formData.get("nome") + " " + formData.get("sobrenome") + " - Loja Loja";

    const nomeConta = document.querySelector(".name-account");
    let textoNomeConta = "Desconhecido";
    let email = "";
    if (formData.get("nome") !== null || formData.get("sobrenome") !== null) {
        textoNomeConta = formData.get("nome") + " " + formData.get("sobrenome");
    }
    if (formData.get("email") !== null) {
        email = formData.get("email");
    }
    nomeConta.textContent = textoNomeConta;

    const elementoEmail = document.querySelector(".email-account");
    elementoEmail.textContent = email;
};

const exibirImagem = () => {
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
    setTimeout(() => {
        
    })
    botaoEnviarFoto.addEventListener("change", (e) => {
        const transaction = bancoDeDados.transaction(["img_os"], "readwrite");
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
};

const pegarProdutosCompletos = (dados, tipo) => {
    const itens = JSON.parse(localStorage.getItem(tipo)) ?? [];
    const produtosCompletos = dados.filter((produto) =>
        itens.includes(produto.id)
    );
    return produtosCompletos;
}

const criarMensagem = (mensagem) => {
    const pMensagemVazio = document.createElement("p");
    pMensagemVazio.textContent = mensagem;
    pMensagemVazio.classList.add("pMensagemVazioSection");
    return pMensagemVazio;
};

const exibirItens = (dados, tipo, id, mensagem) => {
    const produtosCompletos = pegarProdutosCompletos(dados, tipo);
    const divProdutos =
        sectionsCategorias[id].querySelector(".div-produtos");
    for (let produto of produtosCompletos) {
        const divProduto = criarProduto(produto);
        divProdutos.append(divProduto);
    }
    if (produtosCompletos.length === 0) {
        const pMensagemVazio = criarMensagem(mensagem);
        divProdutos.append(pMensagemVazio);
    }
};

const iniciarPaginaConta = (dados) => {
    if (location.search !== "") {
        location.search = "";
    }

    exibirDadosConta();
    exibirImagem();

    exibirItens(dados, "favoritos", 0, "Você não tem itens favoritos");
    exibirItens(dados, "carrinho", 1, "Seu carrinho está vazio");
    exibirItens(dados, "itensComprados", 2, "Você não tem itens no histórico");
};

export default iniciarPaginaConta;