// Funções
const criarElementoImagemProduto = (produto) => {
    const img = document.createElement("img");
    img.src = `assets/products/${produto.image}`;
    img.alt = "Imagem de " + produto.name;
    img.classList.add("img-produto");
    return img;
}

const criarTituloNomeProduto = (produto) => {
    const nomeProduto = document.createElement("figcaption");
    nomeProduto.classList.add("nome-produto");
    nomeProduto.title = produto.name
    nomeProduto.textContent = produto.name;
    return nomeProduto;
}

const criarFigureImagem = (imagem, texto) => {
    const figure = document.createElement("figure");
    figure.classList.add("figure-img");
    figure.append(imagem, texto);
    return figure;
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
    
    if (produto.promotionalPrice !== null) {
        const spanPrecoPromocional = document.createElement("span");
        spanPrecoPromocional.classList.add("preco-antes-promocao");
        spanPrecoPromocional.textContent = `R$ ${produto.price}`;
        spanPreco.append(spanPrecoPromocional, " R$ ", produto.promotionalPrice);
        return spanPreco;
    }
    
    spanPreco.append(`R$ ${produto.price}`);
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

const criarDivInformacoesProduto = ({spanNota, spanPreco}) => {
    const divInformacoes = document.createElement("div");
    divInformacoes.classList.add("informacoes-adicionais-produto");
    divInformacoes.append(spanPreco, spanNota)
    return divInformacoes;
}

const criarBotaoCarrinho = (produto) => {
    const botaoCarrinho = document.createElement("button");
    botaoCarrinho.classList.add("botao-carrinho");
    botaoCarrinho.dataset.id = produto.id;

    const produtosNoCarrinho = JSON.parse(localStorage.getItem("carrinho")) ?? [];
    if (produtosNoCarrinho.includes(produto.id)) {
        botaoCarrinho.classList.add("adicionado-ao-carrinho");
    }

    const imgCarrinho = document.createElement("img");
    imgCarrinho.src = "assets/icons/cart.svg";
    imgCarrinho.alt = "Adicionar ao carrinho de compras";

    botaoCarrinho.append(imgCarrinho);

    botaoCarrinho.addEventListener("click", (e) => {
        const produtosNoCarrinho = JSON.parse(localStorage.getItem("carrinho")) ?? [];
        const botoesProduto = document.querySelectorAll("[data-id]");
        if (produtosNoCarrinho.includes(produto.id)) {
            botoesProduto.forEach(botao => {
                if (botao.dataset.id === produto.id.toString()) {
                    botao.classList.remove("adicionado-ao-carrinho");
                }
            })
            const produtosFiltrados = produtosNoCarrinho.filter((prod) => prod !== produto.id);
            localStorage.setItem("carrinho", JSON.stringify(produtosFiltrados));
            return;
        }
        produtosNoCarrinho.push(produto.id);
        botoesProduto.forEach(botao => {
            if (botao.dataset.id === produto.id.toString()) {
                botao.classList.add("adicionado-ao-carrinho");
            }
        })
        localStorage.setItem("carrinho", JSON.stringify(produtosNoCarrinho));
    })

    return botaoCarrinho;
}

const criarBotaoFavorito = () => {
    const botaoFavorito = document.createElement("button");
    botaoFavorito.classList.add("botao-favorito");
    
    const imgFavorito = document.createElement("img");
    imgFavorito.src = "assets/icons/favorite.svg";
    imgFavorito.alt = "Adicionar aos favoritos";
    
    botaoFavorito.append(imgFavorito);

    return botaoFavorito;
}

const criarBotoesProduto = ({botaoCarrinho, botaoFavorito}) => {
    const divBotoesProduto = document.createElement("div");
    divBotoesProduto.classList.add("botoes-produto");
    divBotoesProduto.append(botaoCarrinho, botaoFavorito);
    return divBotoesProduto;
}

const criarProduto = (produto) => {
    const divProduto = document.createElement("div");
    divProduto.classList.add("produto");

    const linkProduto = document.createElement("a");
    linkProduto.href = "pages/product.html?produto=" + produto.name.toLowerCase().replaceAll(" ", "-");
    linkProduto.classList.add("link-produto")

    // Imagem e nome
    const img = criarElementoImagemProduto(produto);
    const nomeProduto = criarTituloNomeProduto(produto);
    const figure = criarFigureImagem(img, nomeProduto);
    
    // Descrição
    const pDescricao = criarParagrafoDescricao(produto);
    
    // Informações adicionais
    const spanPreco = criarSpanPreco(produto);
    const spanNota = criarSpanNota(produto);
    const divInformacoes = criarDivInformacoesProduto({spanNota, spanPreco});

    // Botões
    const botaoCarrinho = criarBotaoCarrinho(produto);
    const botaoFavorito = criarBotaoFavorito();
    const botoesProduto = criarBotoesProduto({botaoCarrinho, botaoFavorito});

    linkProduto.append(figure, pDescricao, divInformacoes)
    divProduto.append(linkProduto, botoesProduto)

    return divProduto;
}

export default criarProduto;