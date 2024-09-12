const iniciarPaginaLogin = () => {
    const estaLogado = localStorage.getItem("estaLogado") === "true";
    if (estaLogado) {
        location.pathname = "frontend/pages/account.html";
    }

    const form = document.querySelector(".form-login");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            email: form.email.value,
            senha: form.senha.value
        };

        const response = await fetch("http://localhost:3000/usuario/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const resultados = await response.json();
        if (!resultados.success) {
            alert(resultados.message);
            return;
        }
        if (resultados.data.length === 0) {
            alert("Usuário não encontrado");
            return;
        }
        localStorage.setItem("estaLogado", "true");
        localStorage.setItem("usuarioLogado", resultados.data[0].id);
        location.pathname = "frontend/pages/account.html";
    });
};

export default iniciarPaginaLogin;