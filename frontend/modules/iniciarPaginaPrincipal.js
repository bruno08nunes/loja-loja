import criarProduto from "./criarProduto.js";

const sectionsCategorias = document.querySelectorAll(".section-categoria");

const iniciarPaginaPrincipal = (dados) => {
    for (let i = 0; i < sectionsCategorias.length; i++) {
        const section = sectionsCategorias[i];
        const categoria = section.dataset.categoria;
        let produtosCategoria;
        const divProdutos = section.querySelector(".div-produtos");
        if (categoria === "Melhor Avaliado") {
            produtosCategoria = dados.toSorted((a, b) => b.rating - a.rating);
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

    const pesquisar = document.querySelector("#pesquisar");
    pesquisar.addEventListener("input", (e) => {
        const q = pesquisar.value;
        const sectionPesquisa = document.querySelector(".section-pesquisa");
        const divProdutos = sectionPesquisa.querySelector(".div-produtos");

        while (divProdutos.children.length > 0) {
            divProdutos.firstChild.remove();
        }
        
        if (pesquisar.value.length === 0) {
            sectionPesquisa.classList.add("escondida");
            sectionsCategorias.forEach((section) => {
                section.classList.remove("escondida");
            })
            return;
        }
        
        const produtosFiltrados = dados.filter((produto) => produto.name.toLowerCase().includes(q) || produto.description.toLowerCase().includes(q));
        sectionPesquisa.classList.remove("escondida");
        sectionsCategorias.forEach((section) => {
            section.classList.add("escondida");
        })
        for (let produto of produtosFiltrados ?? []) {
            divProdutos.append(criarProduto(produto));
        }
    })
};

export default iniciarPaginaPrincipal