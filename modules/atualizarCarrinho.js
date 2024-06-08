const sidebarCarrinho = document.querySelector(".sidebar-carrinho");
let precoTotal;

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
    const preco = produto.promotionalPrice ?? produto.price;
    spanPrecoProduto.textContent = "R$ " + preco;

    divInformacoesProduto.append(elementoNomeProduto, pDescricaoProduto, spanPrecoProduto);
    return divInformacoesProduto;
}

const criarDivBotaoProdutoCarrinho = (produto) => {
    const divBotaoProduto = document.createElement("div");
    const botaoRemoverProdutoCarrinho = document.createElement("button");
    botaoRemoverProdutoCarrinho.classList.add("botao-remover");
    botaoRemoverProdutoCarrinho.textContent = "X";
    botaoRemoverProdutoCarrinho.ariaLabel = "Remover produto do carrinho";

    botaoRemoverProdutoCarrinho.addEventListener("click", (e) => {
        const produtosNoCarrinho = JSON.parse(localStorage.getItem("carrinho")) ?? [];
        const produtosFiltrados = produtosNoCarrinho.filter((prod) => prod !== produto.id);
        localStorage.setItem("carrinho", JSON.stringify(produtosFiltrados));

        precoTotal -= produto.promotionalPrice ?? produto.price;
        document.querySelector(".preco-carrinho-total").textContent = "Preço Total: R$ " + precoTotal.toFixed(2);

        const botoesProdutoMenu = [...document.querySelectorAll(".botao-carrinho[data-id]")].filter((botao) => botao.dataset.id === produto.id.toString());
        botoesProdutoMenu.forEach((botao) => {
            botao.classList.remove("adicionado-ao-carrinho");
            botao.ariaLabel = "Adicionar ao carrinho";
        })

        botaoRemoverProdutoCarrinho.parentElement.parentElement.remove();

        if (sidebarCarrinho.children.length === 3) {
            sidebarCarrinho.lastChild.remove();
            sidebarCarrinho.lastChild.remove();
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
    const aProduto = document.createElement("a");
    aProduto.classList.add("produto-carrinho")
    aProduto.href = location.href;
    aProduto.pathname = "loja-loja/pages/product.html";
    aProduto.search = "produto=" + produto.id;

    const img = criarImagemProdutoCarrinho(produto);

    const informacoesCarrinho = criarInformacoesProdutoCarrinho(produto);

    const divBotaoProdutoCarrinho = criarDivBotaoProdutoCarrinho(produto);

    aProduto.append(img, informacoesCarrinho)
    divProduto.append(aProduto, divBotaoProdutoCarrinho);
    return divProduto;
}

const criarParagrafoPrecoTotal = () => {
    const paragrafoPreco = document.createElement("p");
    paragrafoPreco.classList.add("preco-carrinho-total");
    paragrafoPreco.textContent = "Preço Total: R$ " + precoTotal.toFixed(2);
    return paragrafoPreco;
}

const criarBotaoCompra = () => {
    const botaoComprar = document.createElement("a");
    botaoComprar.href = location.href;
    botaoComprar.pathname = "loja-loja/pages/form-product.html";
    botaoComprar.classList.add("botao-comprar");
    botaoComprar.textContent = "Fazer Pedido";
    
    return botaoComprar;
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
    precoTotal = produtosCompletosNoCarrinho.reduce((prev, produto) => prev + (produto.promotionalPrice ?? produto.price), 0);
    for (let produto of produtosCompletosNoCarrinho) {
        const divProduto = criarDivProdutoCarrinho(produto);
        sidebarCarrinho.append(divProduto);
    }

    const paragrafoPrecoTotal = criarParagrafoPrecoTotal();
    sidebarCarrinho.append(paragrafoPrecoTotal);
    
    const botaoComprar = criarBotaoCompra();
    sidebarCarrinho.append(botaoComprar);
}

export default atualizarCarrinho;