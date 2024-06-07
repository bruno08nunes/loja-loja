const adicionarInformacoesFormulario = () => {
    const informacoesConta = new FormData();

    const informacoesContaLocalStorage =
        JSON.parse(localStorage.getItem("informacoesConta")) ?? [];

    informacoesContaLocalStorage.forEach((informacao) => {
        informacoesConta.append(informacao[0], informacao[1]);
    });

    const nome = document.querySelector("#nome");
    nome.value = informacoesConta.get("nome");

    const sobrenome = document.querySelector("#sobrenome");
    sobrenome.value = informacoesConta.get("sobrenome");
};

const criarMensagemCompraFinalizada = () => {
    const mensagemCompraFinalizada = document.createElement("p");
    mensagemCompraFinalizada.textContent = "Compra Concluída com Sucesso";
    mensagemCompraFinalizada.classList.add("mensagem-compra-finalizada");
    document.body.append(mensagemCompraFinalizada);
}

const redirecionar = () => {
    setTimeout(() => {
        location.pathname = "";
    }, 2000);
}

const iniciarPaginaFinalizarCompra = () => {
    const estaLogado = localStorage.getItem("estaLogado");
    if (estaLogado === "false") {
        location.pathname = "pages/form-account.html";
    }

    adicionarInformacoesFormulario();

    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itensCarrinhos = JSON.parse(localStorage.getItem("carrinho"));
        const itensComprados =
            JSON.parse(localStorage.getItem("itensComprados")) ?? [];
        itensCarrinhos.forEach((item) => {
            if (!itensComprados.includes(item)) {
                itensComprados.push(item);
            }
        });
        localStorage.setItem("itensComprados", JSON.stringify(itensComprados));
        localStorage.setItem("carrinho", JSON.stringify([]));

        criarMensagemCompraFinalizada();

        redirecionar();
    });
};

export default iniciarPaginaFinalizarCompra;
