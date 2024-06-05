const sidebarCarrinho = document.querySelector(".sidebar-carrinho");

const criarMensagemCarrinhoVazio = () => {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Seu carrinho está vazio. Compre algo na nossa loja!";
    mensagem.classList.add("carrinho-vazio-mensagem");
    return mensagem;
}

const criarImagemProdutoCarrinho = (produto) => {
    const img = document.createElement("img");
    img.src = `assets/products/${produto.image}`;
    img.alt = "Imagem de " + produto.name;
    img.classList.add("img-produto-carrinho");
    return img;
}

const criarInformacoesProdutoCarrinho = (produto) => {
    const divInformacoesProduto = document.createElement("div");
    divInformacoesProduto.classList.add("informacoes-produto-carrinho");

    const elementoNomeProduto = document.createElement("h2");
    elementoNomeProduto.classList.add("nome-produto-carrinho");
    elementoNomeProduto.textContent = produto.name;

    const pDescricaoProduto = document.createElement("p");
    pDescricaoProduto.textContent = produto.description;

    const spanPrecoProduto = document.createElement("span");
    spanPrecoProduto.classList.add("preco-produto-carrinho");
    spanPrecoProduto.textContent = "R$ " + (produto.promotionalPrice ?? produto.price);

    divInformacoesProduto.append(elementoNomeProduto, pDescricaoProduto, spanPrecoProduto);
    return divInformacoesProduto;
}

const criarDivBotaoProdutoCarrinho = (produto) => {
    const divBotaoProduto = document.createElement("div");
    const botaoRemoverProdutoCarrinho = document.createElement("button");
    botaoRemoverProdutoCarrinho.classList.add("botao-remover");
    botaoRemoverProdutoCarrinho.textContent = "X";

    botaoRemoverProdutoCarrinho.addEventListener("click", (e) => {
        const produtosNoCarrinho = JSON.parse(localStorage.getItem("carrinho")) ?? [];
        const produtosFiltrados = produtosNoCarrinho.filter((prod) => prod !== produto.id);
        localStorage.setItem("carrinho", JSON.stringify(produtosFiltrados));

        const botoesProdutoMenu = [...document.querySelectorAll("[data-id]")].filter((botao) => botao.dataset.id === produto.id.toString());
        botoesProdutoMenu.forEach((botao) => {
            botao.classList.remove("adicionado-ao-carrinho");
        })

        botaoRemoverProdutoCarrinho.parentElement.parentElement.remove();

        if (sidebarCarrinho.children.length === 1) {
            const mensagem = criarMensagemCarrinhoVazio();
            sidebarCarrinho.append(mensagem);
        }
    })

    divBotaoProduto.append(botaoRemoverProdutoCarrinho);
    return divBotaoProduto;
}

const criarDivProdutoCarrinho = (produto) => {
    const divProduto = document.createElement("div");
    divProduto.classList.add("produto-carrinho");

    const img = criarImagemProdutoCarrinho(produto);

    const informacoesCarrinho = criarInformacoesProdutoCarrinho(produto);

    const divBotaoProdutoCarrinho = criarDivBotaoProdutoCarrinho(produto);

    divProduto.append(img, informacoesCarrinho, divBotaoProdutoCarrinho);
    return divProduto;
}

const atualizarCarrinho = (produtos) => {
    const produtosNoCarrinho = JSON.parse(localStorage.getItem("carrinho")) ?? [];
    while (sidebarCarrinho.children.length > 1) {
        sidebarCarrinho.removeChild(sidebarCarrinho.lastChild);
    }

    if (produtosNoCarrinho.length === 0) {
        const mensagem = criarMensagemCarrinhoVazio();
        sidebarCarrinho.append(mensagem);
        return;
    }

    const produtosCompletosNoCarrinho = produtos.filter((produto) => produtosNoCarrinho.includes(produto.id));
    for (let produto of produtosCompletosNoCarrinho) {
        const divProduto = criarDivProdutoCarrinho(produto);
        sidebarCarrinho.append(divProduto);
    }
}

export default atualizarCarrinho;