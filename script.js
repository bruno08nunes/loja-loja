// Variáveis
const sectionsCategorias = document.querySelectorAll(".section-categoria");
const divProdutos = document.querySelectorAll(".div-produtos");

// Funções
const criarElementoImagemProduto = (produto) => {
    const img = document.createElement("img");
    img.src = `assets/products/${produto.image}`;
    img.alt = "Imagem de " + produto.name;
    img.classList.add("img-produto");
    return img;
}

const criarTituloNomeProduto = (produto) => {
    const h3NomeProduto = document.createElement("h3");
    h3NomeProduto.classList.add("nome-produto");
    h3NomeProduto.textContent = produto.name;
    return h3NomeProduto;
}

const criarParagrafoDescricao = (produto) => {
    const pDescricao = document.createElement("p");
    pDescricao.classList.add("descricao-produto");
    pDescricao.textContent = produto.description;
    return pDescricao;
}

const criarSpanPreco = (produto) => {
    const spanPreco = document.createElement("span");
    spanPreco.classList.add("preco-produto");
    spanPreco.append(`R$${produto.price}`);

    if (produto.promotionalPrice !== null) {
        const spanPrecoPromocional = document.createElement("span");
        spanPrecoPromocional.classList.add("preco-promocional");
        spanPrecoPromocional.textContent = `R$${produto.promotionalPrice}`;
        spanPreco.append(" ", spanPrecoPromocional);
    }
    return spanPreco;
}

const criarSpanNota = (produto) => {
    const spanNota = document.createElement("span");
    spanNota.classList.add("nota-produto");
    spanNota.textContent = "★".repeat(5);
    
    const notaEmPorcentagem = produto.rating * 20;
    const restoPorcentagem = 100 - notaEmPorcentagem;

    spanNota.style.setProperty("--porcentagem-nota", `${notaEmPorcentagem}%`)
    spanNota.style.setProperty("--porcentagem-branco", `${restoPorcentagem}%`)

    return spanNota;
}

const criarBotoesProduto = () => {
    const divBotoesProduto = document.createElement("div");
    divBotoesProduto.classList.add("botoes-produto");

    const botaoCarrinho = document.createElement("button");
    botaoCarrinho.classList.add("botao-carrinho");

    const botaoFavorito = document.createElement("button");
    botaoFavorito.classList.add("botao-favorito");

    divBotoesProduto.append(botaoCarrinho, botaoFavorito);
    return divBotoesProduto;
}

const criarProduto = (produto) => {
    const divProduto = document.createElement("div");
    divProduto.classList.add("produto")

    const img = criarElementoImagemProduto(produto);

    const h3NomeProduto = criarTituloNomeProduto(produto);
    
    const pDescricao = criarParagrafoDescricao(produto);
    
    const spanPreco = criarSpanPreco(produto);
    
    const spanNota = criarSpanNota(produto);
    document.body.append(spanNota);

    const botoesProduto = criarBotoesProduto();
}

// Inicialização e Eventos
fetch("db.json")
    .then(dados => dados.json())
    .then(dados => {
        criarProduto(dados[5])
    })