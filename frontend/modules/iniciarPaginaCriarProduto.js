const iniciarPaginaCriarProduto = () => {
    const usuarioId = localStorage.getItem("usuarioLogado");
    fetch("https://loja-loja.onrender.com/usuario/informacoes/" + usuarioId)
        .then((res) => res.json())
        .then((res) => {
            if (res.data[0].role !== "A") {
                location.pathname = "frontend";
            }
        });

    const selectCategories = document.querySelector("#categoria");
    fetch("https://loja-loja.onrender.com/categorias/listar")
        .then((res) => res.json())
        .then((res) => {
            for (let pos of res.data) {
                const option = document.createElement("option");
                option.textContent =
                    pos.name[0].toUpperCase() + pos.name.slice(1);
                option.value = pos.id;
                selectCategories.append(option);
            }
        });

    const form = document.querySelector(".form-criar-produto");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            nome: form.nome.value,
            descricao: form.descricao.value,
            preco: form.preco.value,
            precoPromocional:
                form.precoPromocional.value.replace(",", ".") || "",
            quantidade: form.quantidade.value,
            image: form.image.files[0],
        };

        const formData = new FormData();
        for (let prop in data) {
            formData.append(prop, data[prop]);
        }

        const response = await fetch(
            "https://loja-loja.onrender.com/produto/criar",
            {
                method: "POST",
                body: formData,
            }
        );
        const resultado = await response.json();

        if (!resultado.success) {
            console.error(resultado.data);
            alert("Erro ao criar produto");
            return;
        }

        const produtoId = resultado.data.insertId;
        const categorias = [];
        for (let pos of selectCategories.options) {
            if (pos.selected) {
                categorias.push(pos.value);
            }
        }

        const data2 = {
            produto: produtoId,
            categorias,
        };

        const response2 = await fetch(
            "https://loja-loja.onrender.com/produto/categoria/criar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data2),
            }
        );
        const resultado2 = await response2.json();
        if (!resultado2.success) {
            alert("Erro ao conectar categoria e produto");
            console.error(resultado2.data);
            return;
        }

        alert("Produto criado");
    });
};

export default iniciarPaginaCriarProduto;
