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
};

const criarCabecalhoPDF = async () => {
    const header = document.createElement("header");
    header.classList.add("header-pdf");

    const img = await fetch(
        "https://bruno08nunes.github.io/loja-loja/assets/logo.png"
    ).then((dado) => dado.blob());
    const imgLogo = document.createElement("img");
    imgLogo.src = URL.createObjectURL(img);

    const infoHeader = document.createElement("div");
    infoHeader.classList.add("info-header-pdf");

    const nomeLoja = document.createElement("h2");
    nomeLoja.textContent = "Loja Loja";

    const nomeCidade = document.createElement("p");
    nomeCidade.textContent = "São Leopoldo";
    nomeCidade.classList.add("cidade");

    const contatos = document.createElement("p");
    contatos.textContent =
        "Bruno Nunes, Felipe Coimbra Rocha dos Santos e Leonardo Falcão de Matos";
    contatos.classList.add("contatos-pdf");

    const site = document.createElement("a");
    site.href = "https://bruno08nunes.github.io/loja-loja";
    site.textContent = "Site: Loja Loja";

    infoHeader.append(nomeLoja, nomeCidade, contatos, site);
    header.append(imgLogo, infoHeader);
    return header;
};

const criarInformacoesCompradorPDF = async (
    informacoesConta,
    infoFormulario
) => {
    const dadosConta = document.createElement("section");
    dadosConta.classList.add("dados-conta-pdf");

    const dadosPessoa = document.createElement("div");

    const pNomeConta = document.createElement("p");
    pNomeConta.textContent =
        informacoesConta.get("nome") + " " + informacoesConta.get("sobrenome");
    pNomeConta.classList.add("nome-conta-pdf");

    const pEmailConta = document.createElement("p");
    pEmailConta.textContent = informacoesConta.get("email");
    pEmailConta.classList.add("email-conta-pdf");

    const pCPF = document.createElement("p");
    pCPF.textContent = infoFormulario.get("cpf");
    pCPF.classList.add("cpf-conta-pdf");

    dadosPessoa.append(pNomeConta, pEmailConta, pCPF);

    const dadosEndereco = document.createElement("div");

    const localizacao = await fetch(
        `https://viacep.com.br/ws/${infoFormulario.get("cep")}/json/`
    )
        .then((dado) => dado.json())
        .catch((erro) => {
            return { erro };
        });

    if (!localizacao.erro) {
        const pNumeroCasa = document.createElement("p");
        pNumeroCasa.textContent = infoFormulario.get("numero-casa");
        pNumeroCasa.classList.add("numero-casa-conta-pdf");

        const pRua = document.createElement("p");
        pRua.textContent = localizacao.logradouro.replace("Rua ", "");
        pRua.classList.add("rua-conta-pdf");

        const pBairro = document.createElement("p");
        pBairro.textContent = localizacao.bairro;
        pBairro.classList.add("bairro-conta-pdf");

        const pCidade = document.createElement("p");
        pCidade.textContent = localizacao.localidade;
        pCidade.classList.add("cidade-conta-pdf");

        const pEstado = document.createElement("p");
        pEstado.textContent = localizacao.uf;
        pEstado.classList.add("estado-conta-pdf");

        dadosEndereco.append(pNumeroCasa, pRua, pBairro, pCidade, pEstado);
    }

    dadosConta.append(dadosPessoa, dadosEndereco);
    return dadosConta;
};

const gerarPDF = async (itensCarrinhos, dados, infoFormulario) => {
    const pagina = document.createElement("body");
    pagina.classList.add("page-pdf");

    const header = await criarCabecalhoPDF();

    const hrHeader = document.createElement("hr");
    hrHeader.classList.add("hr-pdf");

    const main = document.createElement("main");
    main.classList.add("main-pdf");

    const produtosCompletos = dados.filter((produto) =>
        itensCarrinhos.includes(produto.id)
    );

    const dadosUsuario =
        JSON.parse(localStorage.getItem("informacoesConta")) ?? [];
    const informacoesConta = new FormData();
    for (let pos of dadosUsuario) {
        informacoesConta.append(...pos);
    }

    const dadosConta = await criarInformacoesCompradorPDF(
        informacoesConta,
        infoFormulario
    );

    const hrDados = document.createElement("hr");
    hrDados.classList.add("hr-pdf");

    main.append(dadosConta, hrDados);

    let preco = 0;

    for (let item of produtosCompletos) {
        preco += item.promotionalPrice ?? item.price;

        const pName = document.createElement("p");
        pName.textContent = item.name;
        pName.classList.add("nome-produto-pdf");

        const pPrecoNormal = document.createElement("p");
        pPrecoNormal.textContent = "R$" + item.price;
        pPrecoNormal.classList.add("preco-normal-produto-pdf");

        const pPreco = document.createElement("p");
        pPreco.textContent = "R$" + (item.promotionalPrice ?? item.price);
        pPreco.classList.add("preco-produto-pdf");

        const pQuantidade = document.createElement("p");
        pQuantidade.textContent = 1;
        pQuantidade.classList.add("quantidade-produto-pdf");

        const hrProduto = document.createElement("hr");
        hrProduto.classList.add("hr-pdf");

        main.append(pName, pQuantidade, pPrecoNormal, pPreco, hrProduto);
    }

    const precoTotal = document.createElement("p");
    precoTotal.innerHTML = "<b>Preço Total</b>: R$" + preco.toFixed(2);

    const hrMain = document.createElement("hr");
    hrMain.classList.add("hr-pdf");

    main.append(precoTotal, hrMain);

    const footer = document.createElement("footer");
    footer.classList.add("footer-pdf");
    footer.innerHTML = "<b>OBSERVAÇÕES</b>";
    footer.innerHTML += "<p><b>Prazo de Entrega: </b>30 dias</p>";
    footer.innerHTML +=
        "<p><b>Forma de Pagamento: </b>" +
        infoFormulario.get("tipo-cartao") +
        "</p>";
    footer.innerHTML += "<p><b>Assinatura:</b></p>";

    pagina.append(header, hrHeader, main, footer);

    const options = {
        margin: 10,
        filename: "comprovante-loja-loja.pdf",
        html2canvas: {
            useCORS: true,
        },
    };

    setTimeout(() => {
        html2pdf().set(options).from(pagina, "element").save();
    }, 4000);
};

const redirecionar = () => {
    setTimeout(() => {
        location.pathname = "loja-loja";
    }, 5000);
};

const iniciarPaginaFinalizarCompra = (dados) => {
    const estaLogado = localStorage.getItem("estaLogado") ?? "false";
    if (estaLogado === "false") {
        location.pathname = "loja-loja/pages/form-account.html";
    }

    adicionarInformacoesFormulario();

    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const infoFormulario = new FormData(form);

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

        await gerarPDF(itensCarrinhos, dados, infoFormulario);

        redirecionar();
    });
};

export default iniciarPaginaFinalizarCompra;
