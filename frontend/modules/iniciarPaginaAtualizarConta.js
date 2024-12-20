const deslogar = () => {
    localStorage.setItem("usuarioLogado", null);
    localStorage.setItem("estaLogado", "false");

    location.pathname = "frontend";
};

const iniciarPaginaAtualizarConta = () => {
    const form = document.querySelector(".update-form");

    const userId = localStorage.getItem("usuarioLogado");

    fetch(`https://loja-loja.onrender.com/usuario/informacoes/${userId}`)
        .then((res) => res.json())
        .then((resultados) => {
            if (!resultados.success || resultados.data.length === 0) {
                location.pathname = "frontend";
                return;
            }

            let {
                first_name: nome,
                family_name: sobrenome,
                email,
                cpf,
            } = resultados.data[0];

            form.nome.value = nome;
            form.sobrenome.value = sobrenome;
            form.email.value = email;
            form.cpf.value = cpf;
        });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            nome: form.nome.value,
            sobrenome: form.sobrenome.value,
            cpf: form.cpf.value,
            email: form.email.value,
            senha: form.senha.value,
        };

        const response = await fetch(
            `https://loja-loja.onrender.com/usuario/atualizar/${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        const resultado = await response.json();
        if (!resultado.success) {
            alert("Erro ao atualizar usuário");
            console.error(resultado.err);
            return;
        }
        location.pathname = "frontend/pages/account.html";
    });

    const deleteButton = document.querySelector(".delete-button");
    deleteButton.addEventListener("click", async (e) => {
        const querDeletarConta = confirm(
            "Tem certeza que deseja deletar sua conta?"
        );
        if (!querDeletarConta) {
            return;
        }
        const response = await fetch(
            `https://loja-loja.onrender.com/usuario/deletar/${userId}`,
            {
                method: "DELETE",
            }
        );
        const resultado = await response.json();
        if (!resultado.success) {
            alert("Erro ao deletar usuário");
            console.error(resultado.err);
            return;
        }
        deslogar();
    });
};

export default iniciarPaginaAtualizarConta;
