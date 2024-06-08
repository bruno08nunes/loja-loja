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

const iniciarPaginaLogin = () => {
    const parametrosURL = new URLSearchParams(location.search);
    if (parametrosURL.get("logout") === "true") {
        logout();
    }

    const estaLogado = localStorage.getItem("estaLogado") === "true";
    if (estaLogado) {
        location.pathname = "loja-loja/pages/account.html";
    }

    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        localStorage.setItem("estaLogado", "true");
        localStorage.setItem("informacoesConta", JSON.stringify([...formData]));
        location.pathname = "loja-loja/pages/account.html";
    });
};

export default iniciarPaginaLogin;