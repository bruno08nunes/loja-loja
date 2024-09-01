import criarProduto from "./criarProduto.js";

const sectionsCategorias = document.querySelectorAll(".section-categoria");

const criarProdutos = (produtosCategoria, divProdutos) => {
    if (produtosCategoria?.length >= 4) {
        for (let i = 0; i < 4; i++) {
            const divProduto = criarProduto(produtosCategoria[i]);
            divProdutos.append(divProduto);
        }
    }
};

const iniciarPaginaPrincipal = (dados) => {
    for (let i = 0; i < sectionsCategorias.length; i++) {
        const section = sectionsCategorias[i];
        const categoria = section.dataset.categoria;
        let produtosCategoria;
        const divProdutos = section.querySelector(".div-produtos");
        if (categoria === "Melhor Avaliado") {
            fetch("http://localhost:3000/produtos/listar/melhores")
                .then(res => res.json())
                .then(res => {
                    criarProdutos(res.data, divProdutos);
                })
            continue;
        }
        
        if (categoria === "Mais Baratos") {
            produtosCategoria = dados.toSorted(
                (a, b) =>
                    (a.promotional_price ?? a.price) -
                (b.promotional_price ?? b.price)
            );
            criarProdutos(produtosCategoria, divProdutos);
            continue;
        }
        
        if (categoria === "Em Promoção") {
            produtosCategoria = dados.filter(
                (dado) =>
                    dado.promotional_price !== null
            );
            criarProdutos(produtosCategoria, divProdutos);
            continue;
        }

        fetch("http://localhost:3000/categoria/produto/selecionar/" + categoria)
            .then(res => res.json())
            .then(res => {
                produtosCategoria = [];
                for (let {name} of res.data) {
                    for (let pos in dados) {
                        if (name === dados[pos].name) {
                            produtosCategoria.push(dados[pos]);
                        }
                    }
                }
                criarProdutos(produtosCategoria, divProdutos)
            });
    }

    const pesquisar = document.querySelector("#pesquisar");
    pesquisar.addEventListener("input", (e) => {
        const q = pesquisar.value.toLowerCase();
        const sectionPesquisa = document.querySelector(".section-pesquisa");
        const divProdutos = sectionPesquisa.querySelector(".div-produtos");

        while (divProdutos.children.length > 0) {
            divProdutos.firstChild.remove();
        }

        if (pesquisar.value.length === 0) {
            sectionPesquisa.classList.add("escondida");
            sectionsCategorias.forEach((section) => {
                section.classList.remove("escondida");
            });
            return;
        }

        const produtosFiltrados = dados.filter(
            (produto) =>
                produto.name.toLowerCase().includes(q) ||
                produto.description.toLowerCase().includes(q)
        );
        sectionPesquisa.classList.remove("escondida");
        sectionsCategorias.forEach((section) => {
            section.classList.add("escondida");
        });
        for (let produto of produtosFiltrados ?? []) {
            divProdutos.append(criarProduto(produto));
        }
    });
};

export default iniciarPaginaPrincipal;
