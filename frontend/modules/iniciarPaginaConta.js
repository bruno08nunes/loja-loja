import criarProduto from "./criarProduto.js";

const sectionsCategorias = document.querySelectorAll(".section-categoria");

const deslogar = () => {
    localStorage.setItem("usuarioLogado", null);
    localStorage.setItem("estaLogado", "false");
    
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
    
    location.pathname = "frontend";
}

const botaoDeslogar = document.querySelector(".deslogar");
botaoDeslogar?.addEventListener("click", deslogar);

const exibirDadosConta = () => {
    const userId = localStorage.getItem("usuarioLogado");
    fetch(`http://localhost:3000/usuario/informacoes/${userId}`)
        .then((res) => res.json())
        .then((resultados) => {
            const nomeConta = document.querySelector(".name-account");
            const elementoEmail = document.querySelector(".email-account");

            if (!resultados.success) {
                deslogar();
                return;
            }
            if (resultados.data.length === 0) {
                nomeConta.textContent = "Anônimo";
                return;
            }

            let {
                first_name: nome,
                family_name: sobrenome,
                email,
            } = resultados.data[0];

            document.title = `${nome} ${sobrenome} - Loja Loja`;

            nomeConta.textContent = nome + " " + sobrenome;

            elementoEmail.textContent = email;
        });
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
    setTimeout(() => {});
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
};

const criarMensagem = (mensagem) => {
    const pMensagemVazio = document.createElement("p");
    pMensagemVazio.textContent = mensagem;
    pMensagemVazio.classList.add("pMensagemVazioSection");
    return pMensagemVazio;
};

const exibirItens = (dados, tipo, id, mensagem) => {
    const produtosCompletos = pegarProdutosCompletos(dados, tipo);
    const divProdutos = sectionsCategorias[id].querySelector(".div-produtos");
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
