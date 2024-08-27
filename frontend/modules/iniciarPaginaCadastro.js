const logout = () => {
    localStorage.setItem("estaLogado", "false");
        localStorage.setItem("informacoesConta", JSON.stringify({}));
        let bancoDeDados;
        const openRequest = indexedDB.open("img_db", 1);
        openRequest.addEventListener("error", () => {
            console.error("Banco de dados falhou ao abrir.");
        });
        openRequest.addEventListener("success", () => {
            bancoDeDados = openRequest.result;
            const objectStore = bancoDeDados
                .transaction("img_os", "readwrite")
                .objectStore("img_os");
            const deleteRequest = objectStore.delete(1);
        });
}

const iniciarPaginaCadastro = () => {
    const parametrosURL = new URLSearchParams(location.search);
    if (parametrosURL.get("logout") === "true") {
        logout();
    }

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
            senha: form.senha.value
        }
        
        const response = await fetch("http://localhost:3000/usuario/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            localStorage.setItem("estaLogado", "true");
            location.pathname = "frontend/pages/account.html";
            return;
        }
        console.log("Ocorreu algum erro. Por favor, tente novamente")
    });
};

export default iniciarPaginaCadastro;