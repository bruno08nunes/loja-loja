const informacoesConta = async () => {
    return await fetch(`http://localhost:3000/usuario/informacoes/${localStorage.getItem("usuarioLogado")}`)
        .then((res) => res.json())
        .then(res => res.data[0]);
}

const pegarProduto = (dados) => {
    const parametrosURL = new URLSearchParams(location.search);
    const id = Number(parametrosURL.get("produto"));
    const produto = dados.filter((dado) => dado.id === id)[0];
    return produto;
};

const atualizarImagemProduto = (produto) => {
    const imagem = document.querySelector(".imagem-pagina-produto");
    imagem.src = "http://localhost:3000/uploads/products/" + produto?.image;
    imagem.alt = "Imagem de " + (produto?.name ?? "Produto Desconhecido");
    if (produto.stock_quantity === 0) {
        imagem.classList.add("esgotado");
    }
};

const atualizarNomeProduto = (produto) => {
    const nomeProduto = document.querySelector(".nome-pagina-produto");
    nomeProduto.textContent = produto?.name ?? "Produto desconhecido";
};

const atualizarDescricaoProduto = (produto) => {
    const descricaoProduto = document.querySelector(
        ".descricao-pagina-produto"
    );
    descricaoProduto.textContent = produto?.description ?? "";
};

const atualizarPrecoProduto = (produto) => {
    const elementoPrecoPrePromocao = document.querySelector(
        ".preco-antes-promocao"
    );
    const elementoPreco = document.querySelector(".preco-pagina-produto");
    let precoAtual = produto?.price ?? "";

    const estaEmPromocao =
        produto?.promotional_price !== null &&
        produto?.promotional_price !== undefined;

    if (estaEmPromocao) {
        elementoPrecoPrePromocao.textContent = "R$ " + produto?.price;
        precoAtual = produto?.promotional_price ?? "";
    }
    elementoPreco.textContent = "R$ " + precoAtual;
};

const atualizarAvaliacaoProduto = (produto) => {
    const avaliacaoNumero = document.querySelector(".nota-produto-numero");
    const nota = Number(produto.rating).toFixed(2);
    avaliacaoNumero.textContent = isNaN(nota) ? "?" : nota;

    const avaliacaoEstrela = document.querySelector(".nota-produto");

    const notaEmPorcentagem = nota * 20;

    avaliacaoEstrela.style.setProperty(
        "--porcentagem-nota",
        `${notaEmPorcentagem}%`
    );
    avaliacaoEstrela.style.setProperty(
        "--porcentagem-branco",
        `${0}%`
    );
};

const atualizarInformacoesProduto = (produto) => {
    atualizarImagemProduto(produto);

    atualizarNomeProduto(produto);

    atualizarDescricaoProduto(produto);

    atualizarPrecoProduto(produto);

    atualizarAvaliacaoProduto(produto);
};

const atualizarBotoes = (produto, tipo) => {
    const botao = document.querySelector(`#botao-${tipo}-produto`);
    botao.dataset.id = produto.id;
    botao.ariaLabel = "Adicionar ao " + tipo;

    const idItens = JSON.parse(localStorage.getItem(tipo)) ?? [];
    if (idItens.includes(produto?.id)) {
        botao.classList.add("adicionado-ao-carrinho");
        botao.ariaLabel = "Remover do " + tipo;
    }

    if (tipo === "carrinho" && produto.stock_quantity === 0) {
        botao.disabled = true;
        return;
    }

    botao.addEventListener("click", () => {
        const idItens = JSON.parse(localStorage.getItem(tipo)) ?? [];
        botao.classList.toggle("adicionado-ao-carrinho");
        if (idItens.includes(produto?.id)) {
            const novaLista = idItens.filter((id) => id !== produto?.id);
            localStorage.setItem(tipo, JSON.stringify(novaLista));
            botao.ariaLabel = "Adicionar ao " + tipo;
            return;
        }
        botao.ariaLabel = "Remover do " + tipo;
        idItens.push(produto?.id);
        localStorage.setItem(tipo, JSON.stringify(idItens));
    });
};

const removerDosFavoritos = async (produto, botao) => {
    const resposta = await fetch(
        `http://localhost:3000/favoritos/produto/remover`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                usuario: localStorage.getItem("usuarioLogado"),
                produto: produto.id,
            }),
        }
    );
    const resultado = await resposta.json();

    if (!resultado.success) {
        alert(resultado.message);
        return;
    }
    botao.classList.remove("adicionado-ao-carrinho")
};

const adicionarAosFavoritos = async (produto, botao) => {
    const resposta = await fetch(`http://localhost:3000/produto/favoritar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            usuario: localStorage.getItem("usuarioLogado"),
            produto: produto.id,
        }),
    });
    const resultado = await resposta.json();

    if (!resultado.success) {
        alert(resultado.message);
    }
    botao.classList.add("adicionado-ao-carrinho")
};

const criarBotaoFavorito = (produto) => {
    if (produto.id_products) {
        produto.id = produto.id_products;
    }

    const botaoFavorito = document.querySelector("#botao-favoritos-produto");
    botaoFavorito.dataset.id = produto.id;

    const estaLogado =
        localStorage.getItem("estaLogado") !== null &&
        localStorage.getItem("estaLogado") !== "false";

    if (estaLogado) {
        const estaNosFavoritos = produto.is_favorited;
        if (estaNosFavoritos) {
            botaoFavorito.classList.add("adicionado-ao-carrinho");
        }
        botaoFavorito.addEventListener("click", async function () {
            if (botaoFavorito.classList.contains("adicionado-ao-carrinho")) {
                removerDosFavoritos(produto, botaoFavorito);
                return;
            }
            adicionarAosFavoritos(produto, botaoFavorito);
        });
    }

    if (!estaLogado) {
        botaoFavorito.disabled = true;
    }
};

const criarMensagemSemComentarios = () => {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Nenhum comentário disponível no momento.";
    mensagem.classList.add("comentarios-vazio");
    return mensagem;
};

const criarComentario = () => {
    const comentario = document.createElement("article");
    comentario.classList.add("comentario");
    return comentario;
};

const criarComentarista = (review) => {
    const comentarista = document.createElement("p");
    comentarista.classList.add("comentarista");
    comentarista.textContent = review.reviewer;
    return comentarista;
};

const criarData = (review) => {
    const elementoData = document.createElement("time");
    elementoData.classList.add("data-comentario");

    const data = new Date(review.created_at);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    const date = `${ano}-${mes}-${dia}`;

    const anoReview = date.split("-")[0].padStart(2, 0);
    const mesReview = Number(date.split("-")[1]).toString().padStart(2, 0);
    const diaReview = date.split("-")[2].padStart(2, 0);

    elementoData.textContent = `${diaReview}/${mesReview}/${anoReview}`;
    return elementoData;
};

const criarDadosComentario = (review) => {
    const dadosComentario = document.createElement("div");
    dadosComentario.classList.add("dados-comentario");

    const comentarista = criarComentarista(review);
    const data = criarData(review);

    dadosComentario.append(comentarista, data);

    return dadosComentario;
};

const criarAvaliacaoComentario = (review) => {
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

    return avaliacaoComentario;
};

const criarMensagemComentario = (review) => {
    const pMensagem = document.createElement("p");
    pMensagem.classList.add("mensagem-comentario");
    pMensagem.textContent = review.comment;
    return pMensagem;
};

const criarInputComentario = (produto) => {
    const divComentar = document.createElement("div");
    divComentar.classList.add("div-comentar");

    const imagem = document.createElement("img");
    imagem.src = "";
    let bancoDeDados;
    const openRequest = indexedDB.open("img_db", 1);
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

    const form = document.createElement("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const informacoes = {
            id_users: localStorage.getItem("usuarioLogado"),
            id_products: produto.id,
            rating: form.elements["nota"].value,
            comment: form.elements["comentar"].value,
        };
        
        fetch("http://localhost:3000/comentarios/postar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(informacoes),
        })
        
        const {first_name: reviewer} = await informacoesConta();
        gerarComentarios([{
            reviewer,
            rating: Number(form.elements["nota"].value).toFixed(1),
            comment: form.elements["comentar"].value,
            created_at: Date.now()
        }])

        form.reset();
    });

    const selectNota = document.createElement("select");
    selectNota.classList.add("selecionar-nota");
    selectNota.name = "nota";
    selectNota.id = "nota";
    const option = document.createElement("option");
    option.textContent = "0";
    option.ariaLabel = "Nota 0";
    selectNota.append(option);
    for (let i = 0; i < 5; i++) {
        const option = document.createElement("option");
        option.textContent = "★".repeat(i + 1);
        option.value = i + 1;
        option.ariaLabel = "Nota " + Number(i + 1);
        selectNota.append(option);
    }

    const inputComentar = document.createElement("input");
    inputComentar.name = "comentar";
    inputComentar.id = "comentar";
    inputComentar.placeholder = "Adicione um comentário...";
    inputComentar.required = "true";

    const botao = document.createElement("button");
    botao.textContent = "Comentar";

    fetch("http://localhost:3000/usuario/historico/" + localStorage.getItem("usuarioLogado"))
        .then(res => res.json())
        .then(res => {
            const contemNoHistorico = res.data.some((item) => item.id_products === produto.id)
            if (!contemNoHistorico)  {
                botao.disabled = true;
            }
        });


    form.append(selectNota, inputComentar, botao);
    divComentar.append(imagem, form);

    return divComentar;
};

const gerarComentarios = (reviews) => {
    const comentarios = document.querySelector(".comentarios");
    for (let review of reviews) {
        const comentario = criarComentario();

        const dadosComentario = criarDadosComentario(review);

        const avaliacaoComentario = criarAvaliacaoComentario(review);

        const pMensagem = criarMensagemComentario(review);

        comentario.append(dadosComentario, avaliacaoComentario, pMensagem);
        comentarios.append(comentario);
    }
};

const criarComentarios = (produto) => {
    const sectionComentarios = document.querySelector(".section-comentarios");

    if ((localStorage.getItem("estaLogado") ?? "false") !== "false") {
        const inputComentario = criarInputComentario(produto);
        sectionComentarios.append(inputComentario);
    }

    fetch("http://localhost:3000/comentarios/listar/" + produto.id)
        .then((res) => res.json())
        .then((res) => {
            const reviews = res.data;

            if (reviews.length === 0 || produto === undefined) {
                const mensagem = criarMensagemSemComentarios();
                sectionComentarios.append(mensagem);
                return;
            }

            const comentarios = document.createElement("div");
            comentarios.classList.add("comentarios");
            sectionComentarios.append(comentarios);
            gerarComentarios(reviews);
        });
};

const iniciarPaginaProduto = (dados) => {
    const produto = pegarProduto(dados);

    document.title = produto.name + " - Loja Loja";

    atualizarInformacoesProduto(produto);

    atualizarBotoes(produto, "carrinho");
    criarBotaoFavorito(produto);

    criarComentarios(produto);
};

export default iniciarPaginaProduto;
