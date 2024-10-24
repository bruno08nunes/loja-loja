import criarProduto from "./criarProduto.js";

const iniciarPaginaPesquisa = (dados) => {
    const usuarioId = localStorage.getItem("usuarioLogado");
    fetch("https://loja-loja.onrender.com/usuario/informacoes/" + usuarioId)
        .then((res) => res.json())
        .then((res) => {
            if (res.data[0].role !== "A") {
                location.pathname = "frontend";
            }
        });

    const pesquisar = document.querySelector("#pesquisar");
    pesquisar.addEventListener("input", (e) => {
        const q = pesquisar.value.toLowerCase();
        const sectionPesquisa = document.querySelector(".section-pesquisa");
        const divProdutos = sectionPesquisa.querySelector(".div-produtos");

        const produtosFiltrados = dados.filter(
            (produto) =>
                produto.name.toLowerCase().includes(q) ||
                produto.description.toLowerCase().includes(q)
        );
        divProdutos.innerHTML = "";
        for (let produto of produtosFiltrados ?? []) {
            divProdutos.append(criarProduto(produto, true));
        }
    });
};

export default iniciarPaginaPesquisa;
