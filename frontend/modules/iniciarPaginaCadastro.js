const iniciarPaginaCadastro = () => {
    const estaLogado = localStorage.getItem("estaLogado") === "true";
    if (estaLogado) {
        location.pathname = "frontend/pages/account.html";
    }

    const form = document.querySelector("form");
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
            "https://loja-loja.onrender.com/usuario/cadastrar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const resultado = await response.json();

        if (resultado.success) {
            localStorage.setItem("estaLogado", "true");
            localStorage.setItem("usuarioLogado", resultado.data.insertId);
            location.pathname = "frontend/pages/account.html";
            return;
        }
        console.log("Ocorreu algum erro. Por favor, tente novamente");
    });
};

export default iniciarPaginaCadastro;
