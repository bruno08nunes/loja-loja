import criarProduto from "./criarProduto.js";

const sectionsCategorias = document.querySelectorAll(".section-categoria");

const deslogar = () => {
    localStorage.setItem("usuarioLogado", null);
    localStorage.setItem("estaLogado", "false");

    location.pathname = "frontend";
};

const botaoDeslogar = document.querySelector(".deslogar");
botaoDeslogar?.addEventListener("click", deslogar);

const exibirDadosConta = () => {
    const userId = localStorage.getItem("usuarioLogado");
    fetch(`http://localhost:3000/usuario/informacoes/${userId}`)
        .then((res) => res.json())
        .then((resultados) => {
            const nomeConta = document.querySelector(".name-account");
            const elementoEmail = document.querySelector(".email-account");
            const elementoImagem = document.querySelector(".img-account");

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
                image: imagem,
            } = resultados.data[0];

            document.title = `${nome} ${sobrenome} - Loja Loja`;

            nomeConta.textContent = nome + " " + sobrenome;

            elementoEmail.textContent = email;

            elementoImagem.src = imagem
                ? `assets/users/${imagem}`
                : "assets/icons/account.svg";
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

const exibirItensCarrinho = (dados, tipo, id, mensagem) => {
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

const exibirItens = (tipo, id, mensagem) => {
    fetch(
        `http://localhost:3000/usuario/${tipo}/` +
            localStorage.getItem("usuarioLogado")
    )
        .then((res) => res.json())
        .then((res) => {
            const produtosCompletos = res.data;
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
        });
};

const iniciarPaginaConta = (dados) => {
    exibirDadosConta();

    const botaoEnviarFoto = document.querySelector("#inp-foto-conta");
    botaoEnviarFoto.addEventListener("change", async (e) => {
        const imagemElement = document.querySelector(".img-account");
        const imagem = e.target.files[0];
        const fr = new FileReader();
        fr.onload = () => {
            imagemElement.src = fr.result;
        };
        fr.readAsDataURL(imagem);

        const userId = localStorage.getItem("usuarioLogado");
        const formData = new FormData();
        formData.append("image", imagem);
        const response = await fetch(
            "http://localhost:3000/usuario/foto/atualizar/" + userId,
            {
                method: "PUT",
                body: formData,
            }
        );
    });

    exibirItens("favoritos", 0, "Você não tem itens favoritos");
    exibirItensCarrinho(dados, "carrinho", 1, "Seu carrinho está vazio");
    exibirItens("historico", 2, "Você não tem itens no histórico");
};

export default iniciarPaginaConta;
