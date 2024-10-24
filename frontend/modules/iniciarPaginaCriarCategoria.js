const iniciarPaginaCriarCategoria = () => {
    const usuarioId = localStorage.getItem("usuarioLogado");
    fetch("https://loja-loja.onrender.com/usuario/informacoes/" + usuarioId)
        .then((res) => res.json())
        .then((res) => {
            if (res.data[0].role !== "A") {
                location.pathname = "frontend";
            }
        });

    const form = document.querySelector(".form-create-categories");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            nome: form.nome.value,
            descricao: form.descricao.value,
        };

        const response = await fetch(
            "https://loja-loja.onrender.com/categoria/criar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        const resultado = await response.json();

        if (!resultado.success) {
            alert("Erro ao criar categoria");
            console.error(resultado.data);
            return;
        }

        alert("Categoria criada");
    });
};

export default iniciarPaginaCriarCategoria;
